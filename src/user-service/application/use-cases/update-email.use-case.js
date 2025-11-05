// src/user-service/application/use-cases/update-email.use-case.js
const userRepository = require('../../adapters/out/user.repository.js');

const updateEmailUseCase = async (userId, newEmail) => {
    if (!newEmail) {
        throw new Error('El correo no puede estar vacío.');
    }

    // 1. Verificar si el correo ya está en uso por OTRO usuario
    const existingUser = await userRepository.findByEmail(newEmail);
    if (existingUser && existingUser.id !== userId) {
        throw new Error('El correo electrónico ya está registrado por otro usuario.');
    }

    // 2. Actualizar el correo
    await userRepository.updateUserEmail(userId, newEmail);

    return { message: 'Correo actualizado exitosamente.' };
};

module.exports = { updateEmailUseCase };