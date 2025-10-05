// src/adapters/in/web/auth.controller.js

const loginUserUseCase = require('../../../application/use-cases/login-user.use-case');
const registerUserUseCase = require('../../../application/use-cases/register-user.use-case');

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await registerUserUseCase(username, password);
        res.status(201).json({ 
            message: 'Usuario registrado con éxito', 
            user: { id: newUser.id, username: newUser.username } 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const token = await loginUserUseCase(username, password);
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = {
    register,
    login
};