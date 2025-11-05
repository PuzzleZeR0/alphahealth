// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/adapters/in/web/citas.routes.js
const express = require('express');
const { createCita, getCitas, getAllCitas } = require('./citas.controller.js');;
const adminMiddleware = require('../../../infrastructure/middleware/admin.middleware.js');
const router = express.Router();

router.post('/citas', createCita);   // Ruta: POST /api/citas
router.get('/citas', getCitas);     // Ruta: GET /api/citas
router.get('/citas/all', adminMiddleware, getAllCitas);  // Ruta: GET /api/citas/all (solo admin)

module.exports = router;