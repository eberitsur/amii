const db = require('../config/db');
const path = require('path');
const { now } = require('jquery');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const e = require('express');
const cron = require('node-cron');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads', 'recibos');
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
exports.uploadMiddleware = upload.single('recibo');

exports.index = (req, res) => {
    res.render('ingresos-egresos');
};
exports.getIngresos = (req, res) => {
    db.query('SELECT * FROM ingresos', (err, results) => {
        if (err) {
            console.error("Error al obtener ingresos:", err);
            res.status(500).json({ error: "Error al obtener ingresos" });
            return;
        }
        res.json(results);
    });
};
exports.agregarIngreso = (req, res) => {
    const { concepto, mes, fecha, cantidad, subtotal, total, formaPago, referencia } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!fecha || !concepto || !cantidad || !subtotal || !total) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Ajuste de datos con valores predeterminados
    const ingresoData = {
        concepto,
        mes,
        fecha,
        cantidad,
        subtotal,
        total,
        formaPago,
        referencia
    };

    db.query('INSERT INTO ingresos SET ?', ingresoData, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al agregar ingreso" });
        }
        res.json({ success: true, message: "Ingreso agregado correctamente" });
    });
};

exports.eliminarIngreso = (req, res) => {
    const { id } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!id) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    // Eliminar el ingreso
    db.query('DELETE FROM ingresos WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al eliminar ingreso" });
        }
        res.json({ success: true, message: "Ingreso eliminado correctamente" });
    });
};
exports.editarIngreso = (req, res) => {
    const { concepto, mes, fecha, cantidad, subtotal, total, formaPago, referencia, id } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!fecha || !concepto || !cantidad || !subtotal || !total || !id) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Ajuste de datos con valores predeterminados
    const ingresoData = {
        concepto,
        mes,
        fecha,
        cantidad,
        subtotal,
        total,
        formaPago,
        referencia
    };

    // Consulta SQL corregida
    db.query('UPDATE ingresos SET ? WHERE id = ?', [ingresoData, id], (err, results) => {
        if (err) {
            console.error("Error al editar ingreso:", err);
            return res.status(500).json({ error: "Error al editar ingreso" });
        }

        // Comprobar si se afectaron filas
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Ingreso no encontrado" });
        }

        res.json({ success: true, message: "Ingreso editado correctamente" });
    });
};
exports.getEgresos = (req, res) => {
    db.query('SELECT * FROM egresos', (err, results) => {
        if (err) {
            console.error("Error al obtener egresos:", err);
            res.status(500).json({ error: "Error al obtener egresos" });
            return;
        }
        res.json(results);
    });
};
exports.agregarEgreso = (req, res) => {
    const { concepto, mes, fecha, cantidad, subtotal, total, formaPago, referencia } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!concepto || !fecha || !cantidad || !subtotal || !total || !formaPago) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Ajuste de datos con valores predeterminados
    const egresoData = {
        concepto,
        mes,
        fecha,
        cantidad,
        subtotal,
        total,
        formaPago,
        referencia
    };

    db.query('INSERT INTO egresos SET ?', egresoData, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al agregar egreso" });
        }
        res.json({ success: true, message: "Egreso agregado correctamente" });
    });
};

exports.eliminarEgreso = (req, res) => {
    const { id } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!id) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    // Eliminar el egreso
    db.query('DELETE FROM egresos WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al eliminar egreso" });
        }
        res.json({ success: true, message: "Egreso eliminado correctamente" });
    });
};
exports.editarEgreso = (req, res) => {
    const { concepto, mes, fecha, cantidad, subtotal, total, formaPago, referencia, id } = req.body;

    // Validar que todos los datos requeridos están presentes
    if (!concepto || !fecha || !cantidad || !subtotal || !total || !formaPago || !id) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Ajuste de datos con valores predeterminados
    const egresoData = {
        concepto,
        mes,
        fecha,
        cantidad,
        subtotal,
        total,
        formaPago,
        referencia
    };
    // Consulta SQL corregida
    db.query('UPDATE egresos SET ? WHERE id = ?', [egresoData, id], (err, results) => {
        if (err) {
            console.error("Error al editar egreso:", err);
            return res.status(500).json({ error: "Error al editar egreso" });
        }

        // Comprobar si se afectaron filas
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Egreso no encontrado" });
        }

        res.json({ success: true, message: "Egreso editado correctamente" });
    });
};
exports.estadisticageneral = (req, res) => {
    const query = `
        SELECT 'ingresos' AS tipo, SUM(total) AS total_general
        FROM ingresos
        UNION ALL
        SELECT 'egresos' AS tipo, SUM(total) AS total_general
        FROM egresos;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener estadísticas:", err);
            return res.status(500).json({ error: "Error al obtener estadísticas" });
        }
        res.json(results);
    });
};

exports.estadisticaMes = (req, res) => {
    const { mes, anio } = req.body;

    // Validar que mes y anio son números válidos
    if (!Number.isInteger(mes) || !Number.isInteger(anio)) {
        return res.status(400).json({ error: "Mes y año deben ser números válidos" });
    }
    const query = `
        SELECT 'ingresos' AS tipo, SUM(total) AS total_mes
        FROM ingresos
        WHERE MONTH(fecha) = ${db.escape(mes)} AND YEAR(fecha) = ${db.escape(anio)}
        UNION ALL
        SELECT 'egresos' AS tipo, SUM(total) AS total_mes
        FROM egresos
        WHERE MONTH(fecha) = ${db.escape(mes)} AND YEAR(fecha) = ${db.escape(anio)};
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener estadísticas:", err);
            return res.status(500).json({ error: "Error al obtener estadísticas" });
        }

        // Transformar resultados para asegurar consistencia
        const data = results.map(row => ({
            tipo: row.tipo,
            total_mes: row.total_mes || 0, // Asegurarse de que no haya valores nulos
        }));
        
        res.json(data);
    });
};


exports.estadisticaAno = (req, res) => {
    const { ano } = req.body; // Recibir el año desde el frontend
    console.log(ano);
    // Validar que el año sea un número válido
    if (!ano || isNaN(ano)) {
        return res.status(400).json({ error: "Año no válido" });
    }

    const query = `
    SELECT 
        'ingreso' AS tipo,
        SUM(CASE WHEN MONTH(fecha) = 1 THEN total ELSE 0 END) AS enero,
        SUM(CASE WHEN MONTH(fecha) = 2 THEN total ELSE 0 END) AS febrero,
        SUM(CASE WHEN MONTH(fecha) = 3 THEN total ELSE 0 END) AS marzo,
        SUM(CASE WHEN MONTH(fecha) = 4 THEN total ELSE 0 END) AS abril,
        SUM(CASE WHEN MONTH(fecha) = 5 THEN total ELSE 0 END) AS mayo,
        SUM(CASE WHEN MONTH(fecha) = 6 THEN total ELSE 0 END) AS junio,
        SUM(CASE WHEN MONTH(fecha) = 7 THEN total ELSE 0 END) AS julio,
        SUM(CASE WHEN MONTH(fecha) = 8 THEN total ELSE 0 END) AS agosto,
        SUM(CASE WHEN MONTH(fecha) = 9 THEN total ELSE 0 END) AS septiembre,
        SUM(CASE WHEN MONTH(fecha) = 10 THEN total ELSE 0 END) AS octubre,
        SUM(CASE WHEN MONTH(fecha) = 11 THEN total ELSE 0 END) AS noviembre,
        SUM(CASE WHEN MONTH(fecha) = 12 THEN total ELSE 0 END) AS diciembre,
        SUM(COALESCE(total, 0)) AS total
    FROM ingresos
    WHERE YEAR(fecha) = ?

    UNION ALL

    SELECT 
        'egreso' AS tipo,
        SUM(CASE WHEN MONTH(fecha) = 1 THEN total ELSE 0 END) AS enero,
        SUM(CASE WHEN MONTH(fecha) = 2 THEN total ELSE 0 END) AS febrero,
        SUM(CASE WHEN MONTH(fecha) = 3 THEN total ELSE 0 END) AS marzo,
        SUM(CASE WHEN MONTH(fecha) = 4 THEN total ELSE 0 END) AS abril,
        SUM(CASE WHEN MONTH(fecha) = 5 THEN total ELSE 0 END) AS mayo,
        SUM(CASE WHEN MONTH(fecha) = 6 THEN total ELSE 0 END) AS junio,
        SUM(CASE WHEN MONTH(fecha) = 7 THEN total ELSE 0 END) AS julio,
        SUM(CASE WHEN MONTH(fecha) = 8 THEN total ELSE 0 END) AS agosto,
        SUM(CASE WHEN MONTH(fecha) = 9 THEN total ELSE 0 END) AS septiembre,
        SUM(CASE WHEN MONTH(fecha) = 10 THEN total ELSE 0 END) AS octubre,
        SUM(CASE WHEN MONTH(fecha) = 11 THEN total ELSE 0 END) AS noviembre,
        SUM(CASE WHEN MONTH(fecha) = 12 THEN total ELSE 0 END) AS diciembre,
        SUM(COALESCE(total, 0)) AS total
    FROM egresos
    WHERE YEAR(fecha) = ?;
`;

    db.query(query, [ano, ano], (err, results) => {
        if (err) {
            console.error("Error al obtener estadísticas:", err);
            return res.status(500).json({ error: "Error al obtener estadísticas" });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ error: "No se encontraron datos para el año proporcionado" });
        }

        res.json(results);
    });
};
exports.estadisticaDecada = (req, res) => {
    const { ano } = req.body; // Recibir el año desde el frontend
    if (!ano || isNaN(ano)) {
        return res.status(400).json({ error: "Año inválido o no proporcionado" });
    }

    const inicio = parseInt(ano); // Asegurar que el año sea un entero
    const numeros = Array.from({ length: 11 }, (_, i) => inicio + i); // Generar los años de la década

    let query = `
        SELECT 'ingreso' AS tipo,
    `;

    // Crear las columnas dinámicamente para ingresos
    numeros.forEach((anio, i) => {
        query += `SUM(CASE WHEN YEAR(fecha) = ${anio} THEN total ELSE 0 END) AS 'a${i}', `;
    });

    // Completar la primera parte del query
    query = query.slice(0, -2); // Remover la última coma
    query += `
        FROM ingresos
        UNION ALL
        SELECT 'egreso' AS tipo,
    `;

    // Crear las columnas dinámicamente para egresos
    numeros.forEach((anio, i) => {
        query += `SUM(CASE WHEN YEAR(fecha) = ${anio} THEN total ELSE 0 END) AS 'a${i}', `;
    });

    // Completar el query
    query = query.slice(0, -2); // Remover la última coma
    query += `
        FROM egresos;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener estadísticas:", err);
            return res.status(500).json({ error: "Error al obtener estadísticas" });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ error: "No se encontraron datos para el año proporcionado" });
        }

        res.json(results);
    });
};
