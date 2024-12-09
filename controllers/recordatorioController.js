const db = require('../config/db');
const path = require('path');
const { now } = require('jquery');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const e = require('express');
const cron = require('node-cron');
require('dotenv').config();

function calcularDiferenciaMeses(fecha) {
    const ahora = new Date();
    const fechaVencimiento = new Date(fecha);

    const diferenciaAños = fechaVencimiento.getFullYear() - ahora.getFullYear();
    const diferenciaMeses =
        diferenciaAños * 12 + (fechaVencimiento.getMonth() - ahora.getMonth());

    return diferenciaMeses;
}

// Función para buscar inscripciones que necesiten un recordatorio o actualización de estado
function buscarInscripcionesParaRecordatorioYActualizacion() {
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
      where i.estado='inscrito'
    `;

    db.query(query, (err, resultados) => {
        if (err) throw err;
        resultados.forEach((registro) => {
            const mesesFaltantes = calcularDiferenciaMeses(registro.fechaVencimiento);

            if (new Date(registro.fechaVencimiento) < new Date()) {
                // Si la fecha de vencimiento ya pasó, actualizar estado a "no inscrito"
                console.log('entra en actualizar')
                actualizarEstadoNoInscrito(registro.inscripcionId);
            } else if ([3, 2, 1].includes(mesesFaltantes) && registro.estado === 'inscrito') {
                console.log('entra en mandar email')
                // Si faltan 3, 2 o 1 meses para la fecha de vencimiento, enviar recordatorio
                console.log(
                    `Socio: ${registro.nombre} ${registro.apelllidos}, Email: ${registro.email}, Faltan ${mesesFaltantes} meses.`
                );
                enviarRecordatorio(registro, mesesFaltantes);
            }
        });
    });
}

// Función para actualizar el estado a "no inscrito"
function actualizarEstadoNoInscrito(inscripcionId) {
    const queryActualizar = `
      UPDATE inscripcion 
      SET estado = 'no inscrito'
      WHERE id = ?
    `;

    db.query(queryActualizar, [inscripcionId], (err) => {
        if (err) {
            console.error('Error al actualizar estado a "no inscrito":', err);
        } else {
            console.log(`Estado de la inscripción ${inscripcionId} actualizado a "no inscrito".`);
        }
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
                console.log(
                    `Enviando recordatorio al socio ${registro.nombre} ${registro.apelllidos}.`
                );

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

                if (registro.email) {
                    enviarCorreo(registro.nombre, registro.apelllidos, registro.email, mesesFaltantes);
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
            user: process.env.CORREO,
            pass: process.env.PASS_CORREO
        }
    });

    const mailOptions = {
        from: process.env.CORREO,
        to: correo,
        subject: 'Recordatorio de reinscripción',
        text: `Hola ${nombre} ${apellidos}, faltan ${mesesFaltantes} meses para tu reinscripción. ¡No olvides hacerlo a tiempo!`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error(err);
        else console.log(`Correo enviado: ${info.response}`);
    });
}
// se guarda las ejecuciones en la bd
const registrarEjecucionCron = () => {
    const fechaActual = new Date();
    const query = 'INSERT INTO ejecuciones_cron (fecha, modulo) VALUES (?,?)';

    db.query(query, [fechaActual,'Recordatorio'], (err) => {
        if (err) console.error('Error registrando la ejecución del cron:', err);
        else console.log('Ejecución del cron registrada en la base de datos.');
    });
};

// Ejecuta el script una vez al dia a las 4:00 pm
function configurarCron() {
    cron.schedule('0 16 * * *', () => {
        console.log(`[${new Date().toISOString()}] - Cron ejecutado correctamente. recordatorio`);
        buscarInscripcionesParaRecordatorioYActualizacion();
        registrarEjecucionCron();
    });
}
module.exports = { configurarCron };