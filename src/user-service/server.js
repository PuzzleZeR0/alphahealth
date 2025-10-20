// src/user-service/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./infrastructure/database.js');

// Importar rutas de autenticación
const authRoutes = require('./adapters/in/web/auth.routes.js');

const app = express();
const PORT = process.env.USER_PORT || 3003;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos de usuarios
connectDB();

// --- Rutas de API ---
app.use('/api', authRoutes); // Rutas públicas de Auth (login/registro)

app.listen(PORT, () => {
    console.log(`Servicio de Usuarios corriendo en http://localhost:${PORT}`);
});