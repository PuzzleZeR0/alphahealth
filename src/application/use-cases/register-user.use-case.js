// src/application/use-cases/register-user.use-case.js

const bcrypt = require('bcryptjs');
const { createUser, findByUsername } = require('../../adapters/out/user.repository.js');

const registerUserUseCase = async (username, password) => {
    // Verificar si el usuario ya existe
    const existingUser = await findByUsername(username);
    if (existingUser) {
        throw new Error('El usuario ya existe');
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const newUser = await createUser(username, hashedPassword);
    return newUser;
};

module.exports = registerUserUseCase;