const express = require('express');
const router = express.Router();
const path = require('path');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const ingresosController= require('../controllers/ingresosController');
router.get('/', ingresosController.index);
router.get('/getIngresos', ingresosController.getIngresos);
router.post('/agregarIngreso', ingresosController.agregarIngreso);
router.post('/eliminarIngreso', ingresosController.eliminarIngreso);
router.post('/editarIngreso', ingresosController.editarIngreso);
router.get('/getEgresos', ingresosController.getEgresos);
router.post('/agregarEgreso', ingresosController.agregarEgreso);
router.post('/eliminarEgreso', ingresosController.eliminarEgreso);
router.post('/editarEgreso', ingresosController.editarEgreso);
router.post('/estadisticageneral', ingresosController.estadisticageneral);
router.post('/estadisticaMes', ingresosController.estadisticaMes);
router.post('/estadisticaAno', ingresosController.estadisticaAno);
router.post('/estadisticaDecada', ingresosController.estadisticaDecada);
module.exports = router;