// src/user-service/adapters/in/web/auth.controller.js
const { registerUserUseCase } = require('../../../application/use-cases/register-user.use-case.js');
const { loginUserUseCase } = require('../../../application/use-cases/login-user.use-case.js');
const { getUserProfileUseCase, updateUserProfileUseCase } = require('../../../application/use-cases/profile.use-case.js');
// --- IMPORTAR NUEVOS USE CASES ---
const { updateEmailUseCase } = require('../../../application/use-cases/update-email.use-case.js');
const { updatePasswordUseCase } = require('../../../application/use-cases/update-password.use-case.js');

const register = async (req, res) => {
    const { nombre, email, contraseña } = req.body;
    try {
        await registerUserUseCase(nombre, email, contraseña);
        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, contraseña } = req.body;
    try {
        const token = await loginUserUseCase(email, contraseña);
        res.json({ token, redirectTo: '/views/inicio.html' });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await getUserProfileUseCase(userId);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = req.body;
        await updateUserProfileUseCase(userId, profileData);
        res.status(200).json({ message: 'Perfil actualizado exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// --- NUEVO CONTROLADOR PARA EMAIL ---
const updateEmail = async (req, res) => {
    try {
        const userId = req.user.id; // Del authMiddleware
        const { newEmail } = req.body;
        const result = await updateEmailUseCase(userId, newEmail);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// --- NUEVO CONTROLADOR PARA CONTRASEÑA ---
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id; // Del authMiddleware
        const { newPassword } = req.body;
        const result = await updatePasswordUseCase(userId, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    register,
    login,
    getProfile,    
    updateProfile,
    updateEmail,    // <-- Exportar nuevo controlador
    updatePassword  // <-- Exportar nuevo controlador
};