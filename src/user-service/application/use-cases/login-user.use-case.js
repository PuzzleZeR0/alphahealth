// puzzlezer0/alphahealth/src/user-service/application/use-cases/login-user.use-case.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../../adapters/out/user.repository.js');
const { publishMessage } = require('../../infrastructure/message-broker'); // <-- NUEVO

const loginUserUseCase = async (email, contraseña) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('Credenciales inválidas.');
    }

    const isMatch = await bcrypt.compare(contraseña, user.password);
    if (!isMatch) {
        throw new Error('Credenciales inválidas.');
    }

    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    const payload = { id: user.id, email: user.email, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // --- PUBLICAR MENSAJE EN RABBITMQ ---
    try {
        const message = {
            userId: user.id,
            email: user.email,
            action: 'login',
            timestamp: new Date()
        };
        await publishMessage('user_events', JSON.stringify(message));
    } catch (error) {
        console.error("Error al publicar mensaje de login en RabbitMQ:", error.message);
    }
    // --- FIN DE PUBLICACIÓN ---

    return token;
};

module.exports = { loginUserUseCase };