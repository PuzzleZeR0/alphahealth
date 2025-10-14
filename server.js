// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { connectDB } = require('./src/infrastructure/database.js');
const authRoutes = require('./src/adapters/in/web/auth.routes.js');
const authMiddleware = require('./src/infrastructure/middleware/auth.middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

connectDB();

// --- Rutas ---

// API routes
app.use('/api', authRoutes);

// inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'inicio.html'));
});

// Ruta login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'test', 'login.html'));
});

app.get('/api/usuario', authMiddleware, (req, res) => {
    res.json({ message: 'Acceso a ruta protegida', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});