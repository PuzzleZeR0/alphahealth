// src/user-service/adapters/in/web/auth.routes.js
const express = require('express');
const { 
    register, 
    login, 
    getProfile, 
    updateProfile,
    updateEmail,    // <-- Importar nuevo
    updatePassword  // <-- Importar nuevo
} = require('./auth.controller.js');
const authMiddleware = require('../../../infrastructure/middleware/auth.middleware.js');
const router = express.Router();

// --- Rutas de Autenticación (Públicas) ---
router.post('/registrar', register);
router.post('/login', login);

// --- Rutas de Perfil (Protegidas) ---
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// --- NUEVAS RUTAS DE CUENTA (Protegidas) ---
router.put('/account/email', authMiddleware, updateEmail);
router.put('/account/password', authMiddleware, updatePassword);


module.exports = router;