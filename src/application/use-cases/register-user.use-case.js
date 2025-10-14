// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/application/use-cases/register-user.use-case.js
const bcrypt = require('bcryptjs');
const userRepository = require('../../adapters/out/user.repository.js');

const registerUserUseCase = async (nombre, email, contraseña) => {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('El correo electrónico ya está registrado.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    return await userRepository.createUser(nombre, email, hashedPassword);
};

module.exports = { registerUserUseCase };