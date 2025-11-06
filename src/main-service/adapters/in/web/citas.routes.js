// En: src/main-service/adapters/in/web/citas.routes.js
const express = require('express');
const { createCita, getCitas, getAllCitas, updateCita } = require('./citas.controller.js');; // <-- AÑADE updateCita
const adminMiddleware = require('../../../infrastructure/middleware/admin.middleware.js');
const router = express.Router();

router.post('/citas', createCita);
router.get('/citas', getCitas);
router.get('/citas/all', adminMiddleware, getAllCitas);
router.put('/citas/:id', updateCita); // <-- AÑADE ESTA LÍNEA

module.exports = router;