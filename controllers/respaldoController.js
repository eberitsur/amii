const fs = require('fs');
const { exec } = require('child_process');
const cron = require('node-cron'); // Asegúrate de importar correctamente node-cron
require('dotenv').config();

function configurarRespaldoBD() {
    cron.schedule('0 20 * * 0', () => { // Domingo a las 00:00 horas
        console.log(`[${new Date().toISOString()}] - Iniciando respaldo de la base de datos...`);

        // Nombre del archivo de respaldo
        const fecha = new Date().toISOString().split('T')[0];
        const respaldoArchivo = `baseDeDatos/respaldo_${fecha}.sql`;

        // Eliminar el respaldo anterior
        fs.readdir('baseDeDatos', (err, files) => {
            if (err) {
                console.error('Error al leer la carpeta baseDeDatos:', err);
                return;
            }

            files.forEach(file => {
                if (file.endsWith('.sql')) {
                    fs.unlinkSync(`baseDeDatos/${file}`);
                    console.log('Respaldo anterior eliminado:', file);
                }
            });

            // Comando para realizar el respaldo;
            const comando = `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${respaldoArchivo}`;


            exec(comando, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error al realizar el respaldo:', error.message);
                    return;
                }
                console.log(`Respaldo completado: ${respaldoArchivo}`);
            });
        });
    });
}

module.exports = { configurarRespaldoBD };