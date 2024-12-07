const e = require('express');
const db = require('../config/db');
const path = require('path');
const { now } = require('jquery');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads','comprobantes');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limita el tamaño a 10 MB (ajusta según necesites)
});
exports.uploadMiddleware = upload.single('comprobante');

exports.index = (req, res) => {
    res.render('Socio');
};

exports.getSocios = (req, res) => {
    db.query('SELECT * FROM socios', (err, results, fields) => {
        if (err) throw err;
        res.json(results);
    });
};
exports.getSociosConEstado = (req, res) => {
    const query = `
        SELECT 
            socios.*, 
            pagos.estado 
        FROM 
            socios 
        LEFT JOIN 
            pagos 
        ON 
            socios.id = pagos.socioId
    `;

    db.query(query, (err, results, fields) => {
        if (err) {
            console.error("Error al obtener los socios con estado:", err);
            res.status(500).json({ error: "Error en el servidor" });
            return;
        }
        res.json(results);
    });
};

exports.agregarSocio = (req, res) => {
    const { id, nombre, apelllidos, fechaNacimiento, fechaInscripcion, email, telefono, seccion } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!id || !nombre || !apelllidos || !fechaNacimiento || !fechaInscripcion) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Ajuste en la consulta SQL para usar un objeto en lugar de un arreglo con SET
    const socioData = {
        id,
        nombre,
        apelllidos,
        fechaNacimiento,
        fechaInscripcion,
        email,
        telefono,
        seccion
    };

    db.query('INSERT INTO socios SET ?', socioData, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al agregar socio' });
        }
        res.json({ success: true, message: 'Socio agregado correctamente' });
    });
};

exports.eliminarSocio = (req, res) => {
    const { id } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!id) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Eliminar el socio
    db.query('DELETE FROM socios WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar socio' });
        }
        res.json({ success: true, message: 'Socio eliminado correctamente' });
    });
};

exports.detalles = (req, res) => {
    const { id } = req.body;
    // Validar que todos los datos requeridos están presentes
    req.session.idS = id;
    res.json({ success: true });
};

exports.redirect = (req, res) => {
   if (req.session.idS) {
    res.render('SocioDetalles');
   } else {
    res.redirect('/');
   }
};

exports.getSocio = (req, res) => {
    db.query('SELECT * FROM socios WHERE id = ?', req.session.idS, (err, results, fields) => {
        if (err) throw err;
        res.json(results);
    });
};

exports.setInscripcion = (req, res) => {
    const { id, fechaVencimiento, estado, fechaReinscripcion, socioId } = req.body;

    if (!id || !fechaVencimiento || !estado || !fechaReinscripcion || !socioId) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    db.query('INSERT INTO inscripcion (id,fechaReinscripcion,  estado, fechaVencimiento, socioId) VALUES (?, ?, ?, ?, ?)', 
        [id, fechaVencimiento, estado, fechaReinscripcion, socioId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al agregar inscripción" });
            }
            res.json({ success: true, message: "Inscripción agregada correctamente" });
        });
};

exports.getInscripcion = (req, res) => {
    db.query('SELECT * FROM inscripcion WHERE socioId = ?', [req.session.idS], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al obtener inscripción" });
        }
        res.json(results);
    });
};
exports.uploadMiddleware = upload.single('comprobante');

// Subir un comprobante
exports.subirComprobante = async(req, res) => {
    const file = req.file;
    const { pago_id,NoPago } = req.body;
    const num=Math.floor(Math.random() * 9) + 1;
    const id = `${file.originalname}${num}-${Date.now()}`;
    var numPago = await obtenerNumPago(req.session.idS,pago_id,NoPago);
    if(numPago==true){
        return res.status(400).json({ error: "ya existe ese comprobante" });
    }
   
    const socioId = req.session.idS; // Validación segura para la sesión
    const upload_date = new Date();
    const fechaSubida = new Date().toISOString().split('T')[0]; // Fecha en formato AAAA-MM-DD
    const filePath = path.join(__dirname, '..','uploads','comprobantes', file.originalname);
    fs.readFile(filePath, (err, data) => {
        if (err) throw err;
        const query = 'INSERT INTO comprobantes (id, pago_id, nombre_archivo, ruta_archivo,NoPago, fecha_subida,data, socioId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [id, pago_id, file.originalname, filePath,NoPago, fechaSubida, data, socioId], (err, results) => {
            if (err) throw err,file.originalname,err;
            res.redirect('/socios/redirect');
        });
    });
};
async function obtenerNumPago(id, pago_id,NoPago) {
    const query = `SELECT NoPago FROM comprobantes WHERE socioId = '${id}' and pago_id = '${pago_id}' and NoPago='${NoPago}'`;
    try {
        // Envolver `db.query` en una Promesa
        const results = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) {
                    reject(err); // Rechazar si hay un error
                } else {
                    resolve(results); // Resolver con los resultados
                }
            });
        });

        if (results.length > 0) {
            return true; // Retornar resultados si hay datos
        } else {
            return false; // Retornar null si no hay datos
        }
    } catch (error) {
        console.error('Error al obtener el número de pago:', error.message);
        return null; // Retornar null en caso de error
    }
}

async function comprobar(id) {
    const result = await db.query('SELECT * FROM pagos WHERE id = ?', [id]);
    if (result.length > 0) {
        return true;
    } else {
        return false;
    }
}

exports.agregarPago = async (req, res) => {
    const {
        id,
        concepto,
        pago1,
        fechaP1,
        pago2,
        fechaP2,
        pago3,
        fechaP3,
        idInscripcion,
        subtotal,
        restante,
        total,
        fechaPago,
    } = req.body;
    var estado=''
    // Asignar null si las fechas están vacías o indefinidas
    const fechaP1Final = fechaP1 ? fechaP1 : null;
    const fechaP2Final = fechaP2 ? fechaP2 : null;
    const fechaP3Final = fechaP3 ? fechaP3 : null;
    const fechaPagoFinal = fechaPago ? fechaPago : null;
    if(total>subtotal){
        estado='pendiente'
    }else{
        estado='pagado'
    }

    console.log(
        idInscripcion,
        subtotal,
        restante,
        total,
        fechaPago,
        id,
        concepto,
        pago1,
        fechaP1Final,
        pago2,
        fechaP2Final,
        pago3,
        fechaP3Final
    );

    try {
        const comprobante = await comprobar(idInscripcion);

        if (comprobante) {
            return res.status(400).json({
                error: 'Solo puede agregar un pago por inscripción',
            });
        } else {
            db.query(
                'INSERT INTO pagos (id, concepto, pago1, fechaP1, pago2, fechaP2, pago3, fechaP3,fecha, subtotal, restante, total,estado, inscripcionId, socioId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)',
                [
                    id,
                    concepto,
                    pago1,
                    fechaP1Final,
                    pago2,
                    fechaP2Final,
                    pago3,
                    fechaP3Final,
                    fechaPagoFinal,
                    subtotal,
                    restante,
                    total,
                    estado,
                    idInscripcion,
                    req.session.idS,
                ],
                (err, results) => {
                    if (err) {
                        console.error(err);
                        return res
                            .status(500)
                            .json({ error: 'Error al agregar pago' });
                    }
                    res.json({
                        success: true,
                        message: 'Pago agregado correctamente',
                    });
                }
            );
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: 'Error al comprobar el pago' });
    }
};


exports.getPagos = (req, res) => {
    db.query('SELECT * FROM pagos WHERE socioId = ?', [req.session.idS], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener pagos' });
        }
        res.json(results);
    });
};

exports.obtenerComprobantes = async (req, res) => {
    db.query('SELECT * FROM comprobantes where socioId=?', [req.session.idS], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener comprobantes' });
        }
        res.json(results);
    }); 
};





//editar socio
exports.editarSocio = (req, res) => {
    const { id, nombre, apellido, fechaNacimiento, fechaInscripcion, email, telefono, seccion } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!id || !nombre || !apellido || !fechaNacimiento || !fechaInscripcion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Ajuste de datos con valores predeterminados
    const socioData = {
        nombre,
        apelllidos: apellido,
        fechaNacimiento,
        fechaInscripcion,
        email: email || null,
        telefono: telefono || null,
        seccion: seccion || null
    };

    // Consulta SQL corregida
    db.query('UPDATE socios SET ? WHERE id = ?', [socioData, id], (err, results) => {
        if (err) {
            console.error('Error al editar socio:', err);
            return res.status(500).json({ error: 'Error al editar socio' });
        }

        // Comprobar si se afectaron filas
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        res.json({ success: true, message: 'Socio editado correctamente' });
    });
};
exports.editarInscripcion = (req, res) => {
    const { id, fechaVencimiento, estado, fechaReinscripcion } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!id || !fechaVencimiento || !estado || !fechaReinscripcion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Ajuste de datos con valores predeterminados
    const inscripcionData = {
        fechaVencimiento,
        estado,
        fechaReinscripcion
    };

    // Consulta SQL corregida
    db.query('UPDATE inscripcion SET ? WHERE id = ?', [inscripcionData, id], (err, results) => {
        if (err) {
            console.error('Error al editar inscripción:', err);
            return res.status(500).json({ error: 'Error al editar inscripción' });
        }

        // Comprobar si se afectaron filas
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }

        res.json({ success: true, message: 'Inscripción editada correctamente' });
    });
};
exports.editarPago = (req, res) => {
    const { id,fechaPago, concepto, pago1, fechaP1, pago2, fechaP2, pago3, fechaP3, subtotal, restante, total, idInscripcion } = req.body;
    console.log(concepto,id,pago1,pago2,pago3,subtotal,restante,total,idInscripcion);
    // Validar que todos los datos requeridos están presentes
    var estado=''
    if(total>subtotal){
        estado='pendiente'
    }else{
        estado='pagado'
    }

    // Ajuste de datos con valores predeterminados
    const pagoData = {
        fecha: fechaPago || null,
        concepto,
        pago1,
        fechaP1: fechaP1 || null,
        pago2,
        fechaP2: fechaP2 || null,
        pago3,
        fechaP3: fechaP3 || null,
        subtotal,
        restante,
        total,
        estado,
        inscripcionId: idInscripcion
    };

    // Consulta SQL corregida
    db.query('UPDATE pagos SET ? WHERE id = ?', [pagoData, id], (err, results) => {
        if (err) {
            console.error('Error al editar pago:', err);
            return res.status(500).json({ error: 'Error al editar pago' });
        }

        // Comprobar si se afectaron filas
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        res.json({ success: true, message: 'Pago editado correctamente' });
    });
};
exports.eliminarPago = (req, res) => {
    const { id } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!id) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Eliminar el pago
    db.query('DELETE FROM pagos WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar pago' });
        }
        res.json({ success: true, message: 'Pago eliminado correctamente' });
    });
};
exports.eliminarInscripcion = (req, res) => {
    const { id } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!id) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Eliminar el pago
    db.query('DELETE FROM inscripcion WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar inscripción' });
        }
        res.json({ success: true, message: 'Inscripción eliminada correctamente' });
    });
};
exports.eliminarComprobante = (req, res) => {
    const { id } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!id) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Eliminar el pago
    db.query('DELETE FROM comprobantes WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar comprobante' });
        }
        res.json({ success: true, message: 'Comprobante eliminado correctamente' });
    });
};
exports.visualizarComprobante = (req, res) => {
    const { id } = req.params;
    console.log(id);
    // Consulta para obtener el archivo desde la base de datos
    const query = 'SELECT nombre_archivo, data FROM comprobantes WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener el archivo:', err);
            return res.status(500).json({ error: 'Error al obtener el comprobante' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Comprobante no encontrado' });
        }

        const comprobante = result[0];
        const fileName = comprobante.nombre_archivo; // Nombre del archivo con extensión
        console.log(fileName);
        const fileUrl = `http://192.168.100.27:8081/uploads/comprobantes/${fileName}`; // Usar la ruta relativa dentro de '/uploads'

        // Devolver la URL del archivo para que se pueda abrir en una nueva pestaña
        res.json({
            url: fileUrl
        });
    });
};


exports.descargarComprobante = (req, res) => {
    const { id } = req.body;
    const query = 'SELECT nombre_archivo, data FROM comprobantes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener el archivo:', err);
            res.status(500).send('Error al obtener el archivo');
            return;
        }
        if (result.length === 0) {
            console.log('Archivo no encontrado');
            res.status(404).send('Archivo no encontrado');
            return;
        }
        
        const file = result[0];
        const fileName = file.nombre_archivo; // Nombre del archivo con extensión

        // Configurar las cabeceras para la descarga
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(file.data); // Enviar los datos binarios del archivo
    });
};
