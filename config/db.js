const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'natsuylucy',
    database: 'AMII'
});

// Inicia la conexión
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

module.exports = db;
