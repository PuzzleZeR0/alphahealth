// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/adapters/in/web/auth.routes.js
const express = require('express');
// --- IMPORTAR NUEVOS CONTROLADORES Y MIDDLEWARE ---
const { register, login, getProfile, updateProfile } = require('./auth.controller.js');
const authMiddleware = require('../../../infrastructure/middleware/auth.middleware.js'); // <-- Línea corregida
const router = express.Router();

// --- Rutas existentes ---
router.post('/registrar', register);
router.post('/login', login);

// --- NUEVAS RUTAS PARA PERFIL (Protegidas por authMiddleware) ---
router.get('/profile', authMiddleware, getProfile);       // Ruta: GET /api/profile
router.put('/profile', authMiddleware, updateProfile);    // Ruta: PUT /api/profile

// Podrías usar POST en lugar de PUT si prefieres, ambos funcionan para crear/actualizar
// router.post('/profile', authMiddleware, updateProfile); // Ruta: POST /api/profile


module.exports = router;