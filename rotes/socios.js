const express = require('express');
const router = express.Router();
const path = require('path');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const socioController= require('../controllers/sociosController');
router.get('/', socioController.index);
router.get('/getSocios', socioController.getSocios);
router.post('/agregarSocio', socioController.agregarSocio);
router.post('/eliminarSocio', socioController.eliminarSocio);
router.post('/detalles', socioController.detalles);
router.get('/redirect', socioController.redirect);
router.get('/getSocio', socioController.getSocio);
router.post('/setInscripcion',socioController.setInscripcion);
router.get('/getInscripcion',socioController.getInscripcion);
router.post('/agregarPago',socioController.agregarPago);
router.get('/comprobantes', socioController.obtenerComprobantes);
router.post('/descargar', socioController.descargarComprobante);
router.get('/getPagos', socioController.getPagos);
router.post('/subir-comprobante',socioController.uploadMiddleware, socioController.subirComprobante);
router.post('/editarSocio', socioController.editarSocio);
router.post('/editarInscripcion', socioController.editarInscripcion);
router.post('/editarPago', socioController.editarPago);
router.get('/visualizarComprobante/:id', socioController.visualizarComprobante);
router.post('/eliminarPago', socioController.eliminarPago);
router.post('/eliminarInscripcion', socioController.eliminarInscripcion);
router.post('/eliminarComprobante', socioController.eliminarComprobante);
router.get('/getSociosConEstado', socioController.getSociosConEstado);
module.exports = router;