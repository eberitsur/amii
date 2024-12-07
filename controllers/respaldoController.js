const fs = require('fs');
const { exec } = require('child_process');
const cron = require('node-cron'); // Asegúrate de importar correctamente node-cron
require('dotenv').config();

function configurarRespaldoBD() {
    cron.schedule('0 20 * * 0', () => { // Domingo a las 20:00 horas
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

            // Comando para realizar el respaldo
            const comando = `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${respaldoArchivo}`;

            exec(comando, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error al realizar el respaldo:', error.message);
                    return;
                }
                console.log(`Respaldo completado: ${respaldoArchivo}`);

                // Sincronizar el repositorio
                sincronizarRepositorioGit();
            });
        });
    });
}

function sincronizarRepositorioGit() {
    console.log(`[${new Date().toISOString()}] - Sincronizando repositorio Git...`);

    const comandosGit = [
        `git add .`, // Agregar todos los archivos nuevos y modificados
        `git commit -m "Respaldo semanal automático: ${new Date().toISOString().split('T')[0]}"`, // Crear un commit con la fecha
        `git push` // Subir todos los cambios al repositorio remoto
    ];

    // Ejecutar los comandos de Git en serie
    ejecutarComandosGit(comandosGit);
}

function ejecutarComandosGit(comandos) {
    if (comandos.length === 0) return;

    const comando = comandos.shift();
    exec(comando, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando "${comando}":`, error.message);
            return;
        }
        console.log(`Comando ejecutado: ${comando}`);
        console.log(stdout || stderr);

        // Ejecutar el siguiente comando
        ejecutarComandosGit(comandos);
    });
}

module.exports = { configurarRespaldoBD };
