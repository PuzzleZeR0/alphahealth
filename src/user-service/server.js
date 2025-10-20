// puzzlezer0/alphahealth/src/user-service/server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./infrastructure/database.js');
const { connectRabbitMQ, consumeMessage } = require('./infrastructure/message-broker.js'); // <-- NUEVO

// Importar rutas de autenticación
const authRoutes = require('./adapters/in/web/auth.routes.js');

const app = express();
const PORT = process.env.USER_PORT || 3003;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas de API ---
app.use('/api', authRoutes);

// --- Función para iniciar el servidor ---
const startServer = async () => {
    try {
        // 1. Conectar a la Base de Datos
        await connectDB();

        // 2. Conectar a RabbitMQ
        await connectRabbitMQ();

        // 3. Empezar a consumir mensajes (para logueo en esta terminal)
        await consumeMessage('user_events', (msg) => {
            const message = JSON.parse(msg.content.toString());
            console.log(`[RabbitMQ] Mensaje Recibido: Usuario ${message.email} realizó acción de '${message.action}'`);
        });

        // 4. Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log(`Servicio de Usuarios corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al iniciar el servidor de usuarios:", error);
        process.exit(1);
    }
};

// Iniciar todo
startServer();