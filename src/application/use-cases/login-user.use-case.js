// src/application/use-cases/login-user.use-case.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByUsername } = require('../../adapters/out/user.repository.js');

const loginUserUseCase = async (username, password) => {
    // Buscar al usuario por su nombre
    const user = await findByUsername(username);
    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    // Comparar la contraseña proporcionada con la cifrada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Credenciales inválidas');
    }

    // Generar un token JWT
    const payload = {
        id: user.id,
        username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
};

module.exports = loginUserUseCase;