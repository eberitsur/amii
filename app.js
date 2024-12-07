const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const socioRouter = require('./rotes/socios');
const fs = require('fs'); // Importar el módulo fs para manejar archivos
const ingresosRouter = require('./rotes/ingresos');
require('dotenv').config();

const app = express();

// Configuración del motor de vistas
app.set('view engine', 'ejs');

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Necesario para parsear cuerpos JSON
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
  secret: 'your_secret_key', // Cambia esto por un secreto más seguro
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));
app.use('/socios',socioRouter);
app.use('/ingresos',ingresosRouter);
app.get('/', (req, res) => {
  req.session.destroy(function(error){
    console.log("Session Destroyed")
})
  res.render('socio');
});
// En app.js
const { configurarCron } = require('./controllers/recordatorioController');
const { configurarRespaldoBD }= require('./controllers/respaldoController');
configurarRespaldoBD();
configurarCron();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mime = require('mime-types'); // Importar mime-types

// Función para manejar la descarga



// Iniciar el servidor
app.listen(process.env.PORT, process.env.SERVER_HOST, () => {
  console.log(`Servidor escuchando en http://192.168.100.27:${process.env.PORT}`);
});
