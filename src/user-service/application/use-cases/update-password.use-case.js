// src/user-service/application/use-cases/update-password.use-case.js
const bcrypt = require('bcryptjs');
const userRepository = require('../../adapters/out/user.repository.js');

const updatePasswordUseCase = async (userId, newPassword) => {
    if (!newPassword || newPassword.length < 6) { // Asumimos una regla de 6+ caracteres
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    // 1. Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 2. Actualizar en la base de datos
    await userRepository.updateUserPassword(userId, hashedPassword);

    return { message: 'Contraseña actualizada exitosamente.' };
};

module.exports = { updatePasswordUseCase };