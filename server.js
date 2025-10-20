// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { connectDB } = require('./src/infrastructure/database.js');

// --- Importar Rutas y Middleware ---
const authRoutes = require('./src/adapters/in/web/auth.routes.js');
const citasRoutes = require('./src/adapters/in/web/citas.routes.js'); // NUEVO
const authMiddleware = require('./src/infrastructure/middleware/auth.middleware.js'); // NUEVO

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos
connectDB();

// --- Rutas ---

// Rutas de API
app.use('/api', authRoutes); // Rutas públicas de Auth (login/registro)
app.use('/api', authMiddleware, citasRoutes); // Rutas protegidas de Citas (USA EL MIDDLEWARE)

// Rutas de Vistas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'inicio.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'test', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});