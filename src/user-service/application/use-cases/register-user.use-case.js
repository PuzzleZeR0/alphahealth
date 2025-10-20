// puzzlezer0/alphahealth/src/user-service/application/use-cases/register-user.use-case.js
const bcrypt = require('bcryptjs');
const userRepository = require('../../adapters/out/user.repository.js');
const { publishMessage } = require('../../infrastructure/message-broker'); // <-- NUEVO

const registerUserUseCase = async (nombre, email, contraseña) => {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('El correo electrónico ya está registrado.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    const newUser = await userRepository.createUser(nombre, email, hashedPassword);

    // --- PUBLICAR MENSAJE EN RABBITMQ ---
    try {
        const message = {
            userId: newUser.id,
            email: newUser.email,
            action: 'register',
            timestamp: new Date()
        };
        await publishMessage('user_events', JSON.stringify(message));
    } catch (error) {
        console.error("Error al publicar mensaje de registro en RabbitMQ:", error.message);
        // (Decidir si fallar la operación o solo loguear el error)
    }
    // --- FIN DE PUBLICACIÓN ---

    return newUser;
};

module.exports = { registerUserUseCase };