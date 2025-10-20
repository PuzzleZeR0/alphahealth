// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/application/use-cases/login-user.use-case.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../../adapters/out/user.repository.js');

const loginUserUseCase = async (email, contraseña) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('Credenciales inválidas.');
    }

    const isMatch = await bcrypt.compare(contraseña, user.password);
    if (!isMatch) {
        throw new Error('Credenciales inválidas.');
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
};

module.exports = { loginUserUseCase };