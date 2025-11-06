// src/user-service/adapters/in/web/auth.routes.js
const express = require('express');
const { 
    register, 
    login, 
    getProfile, 
    updateProfile,
    updateEmail,    
    updatePassword, 
    getAllProfiles // <-- Importar nuevo 
} = require('./auth.controller.js');
const authMiddleware = require('../../../infrastructure/middleware/auth.middleware.js');
const adminMiddleware = require('../../../infrastructure/middleware/admin.middleware.js'); // <-- Importar admin middleware
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

router.get('/profiles/all', authMiddleware, adminMiddleware, getAllProfiles);


module.exports = router;