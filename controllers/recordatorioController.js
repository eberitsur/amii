const db = require('../config/db');
const path = require('path');
const { now } = require('jquery');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const e = require('express');
const cron = require('node-cron');
function calcularDiferenciaMeses(fecha) {
    const ahora = new Date();
    const fechaVencimiento = new Date(fecha);

    const diferenciaAños = fechaVencimiento.getFullYear() - ahora.getFullYear();
    const diferenciaMeses =
        diferenciaAños * 12 + (fechaVencimiento.getMonth() - ahora.getMonth());

    return diferenciaMeses;
}
// Función para buscar inscripciones que necesiten un recordatorio
function buscarInscripcionesParaRecordatorio() {
    const query = `
      SELECT 
        i.id AS inscripcionId,
        i.fechaVencimiento,
        i.estado,
        s.id AS socioId,
        s.nombre,
        s.apelllidos,
        s.email
      FROM inscripcion i
      JOIN socios s ON i.socioId = s.id
      WHERE i.estado = 'pagado'
    `;

    db.query(query, (err, resultados) => {
        if (err) throw err;

        resultados.forEach((registro) => {
            const mesesFaltantes = calcularDiferenciaMeses(registro.fechaVencimiento);

            // Verificamos si faltan 3, 2 o 1 meses para la fecha de vencimiento
            if ([3, 2, 1].includes(mesesFaltantes)) {
                console.log(
                    `Socio: ${registro.nombre} ${registro.apelllidos}, Email: ${registro.correo}, Faltan ${mesesFaltantes} meses.`
                );

                // Enviar recordatorio si no se ha enviado este mes
                enviarRecordatorio(registro, mesesFaltantes);
            }
        });
    });
}
// Función para enviar el recordatorio
function enviarRecordatorio(registro, mesesFaltantes) {
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();

    const queryVerificar = `
      SELECT * FROM recordatorios 
      WHERE socioId = ? AND inscripcionId = ? AND mes = ? AND anio = ?
    `;

    db.query(
        queryVerificar,
        [registro.socioId, registro.inscripcionId, mesActual, anioActual],
        (err, resultados) => {
            if (err) throw err;

            if (resultados.length === 0) {
                // Si no existe un recordatorio, enviarlo
                console.log(
                    `Enviando recordatorio al socio ${registro.nombre} ${registro.apelllidos}.`
                );

                // Registrar el recordatorio en la base de datos
                const queryInsertar = `
            INSERT INTO recordatorios (socioId, inscripcionId, mes, anio)
            VALUES (?, ?, ?, ?)
          `;
                db.query(
                    queryInsertar,
                    [registro.socioId, registro.inscripcionId, mesActual, anioActual],
                    (err) => {
                        if (err) throw err;
                        console.log('Recordatorio registrado correctamente.');
                    }
                );

                // Opcional: Enviar correo con nodemailer
                if (registro.correo) {
                    enviarCorreo(recordio.nombre, registro.apelllidos, registro.correo, mesesFaltantes);
                }
            } else {
                console.log(
                    `Ya se envió un recordatorio este mes al socio ${registro.nombre} ${registro.apelllidos}.`
                );
            }
        }
    );
}
// Opcional: Enviar correo con nodemailer
function enviarCorreo(nombre, apellidos, correo, mesesFaltantes) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tu_correo@gmail.com',
            pass: 'tu_contraseña'
        }
    });

    const mailOptions = {
        from: 'tu_correo@gmail.com',
        to: correo,
        subject: 'Recordatorio de reinscripción',
        text: `Hola ${nombre} ${apellidos}, faltan ${mesesFaltantes} meses para tu reinscripción. ¡No olvides hacerlo a tiempo!`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error(err);
        else console.log(`Correo enviado: ${info.response}`);
    });
}
const registrarEjecucionCron = () => {
    const fechaActual = new Date();
    const query = 'INSERT INTO ejecuciones_cron (fecha) VALUES (?)';
  
    db.query(query, [fechaActual], (err) => {
      if (err) console.error('Error registrando la ejecución del cron:', err);
      else console.log('Ejecución del cron registrada en la base de datos.');
    });
  };

// Ejecuta el script el día 1 de cada mes
function configurarCron() {
    cron.schedule('0 16 * * *', () => { // Configurado para el primer día de cada mes
        console.log(`[${new Date().toISOString()}] - Cron ejecutado correctamente.`);
        // Aquí va tu lógica, por ejemplo:
        buscarInscripcionesParaRecordatorio();
        registrarEjecucionCron();
    });
}
module.exports = { configurarCron };