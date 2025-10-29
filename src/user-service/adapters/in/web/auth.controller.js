// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/adapters/in/web/auth.controller.js
const { registerUserUseCase } = require('../../../application/use-cases/register-user.use-case.js');
const { loginUserUseCase } = require('../../../application/use-cases/login-user.use-case.js');
const { getUserProfileUseCase, updateUserProfileUseCase } = require('../../../application/use-cases/profile.use-case.js');

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

// --- NUEVAS FUNCIONES DEL CONTROLADOR ---

/**
 * Obtiene el perfil del usuario autenticado.
 */
const getProfile = async (req, res) => {
    try {
        // El ID del usuario viene del token gracias al authMiddleware
        const userId = req.user.id;
        const profile = await getUserProfileUseCase(userId);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Actualiza (o crea) el perfil del usuario autenticado.
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = req.body; // Los datos vienen en el cuerpo de la petición PUT/POST
        await updateUserProfileUseCase(userId, profileData);
        res.status(200).json({ message: 'Perfil actualizado exitosamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,    
    updateProfile  
};