// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/adapters/in/web/auth.controller.js
const { registerUserUseCase } = require('../../../application/use-cases/register-user.use-case.js');
const { loginUserUseCase } = require('../../../application/use-cases/login-user.use-case.js');

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

module.exports = {
    register,
    login,
};