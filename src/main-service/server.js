// puzzlezer0/alphahealth/src/main-service/server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Asegúrate de que esté importado
const path = require('path');
const { connectDB } = require('./infrastructure/database.js');

// --- Importar Rutas y Middleware ---
const citasRoutes = require('./adapters/in/web/citas.routes.js');
const authMiddleware = require('./infrastructure/middleware/auth.middleware.js');

const app = express();
const PORT = process.env.MAIN_PORT || 5555;

// Middleware
app.use(cors());

// --- AÑADIR ESTA CONFIGURACIÓN PARA HELMET ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "connect-src": ["'self'", "http://localhost:3003"], // Permite conexiones a sí mismo y al servicio de usuarios
      },
    },
  })
);
// --- FIN DE LA CONFIGURACIÓN DE HELMET ---

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ¡Importante! Servir archivos públicos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '../../public')));

// Conexión a la base de datos principal
connectDB();

// --- Rutas ---
app.use('/api', authMiddleware, citasRoutes); // Rutas protegidas de Citas

// Rutas de Vistas (Sirve el frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'views', 'inicio.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'views', 'test', 'login.html'));
});

// Redirigir otras vistas
app.get('/views/:page', (req, res) => {
     res.sendFile(path.join(__dirname, '../../public', 'views', req.params.page));
});
app.get('/views/test/:page', (req, res) => {
     res.sendFile(path.join(__dirname, '../../public', 'views', 'test', req.params.page));
});


app.listen(PORT, () => {
    console.log(`Servicio Principal corriendo en http://localhost:${PORT}`);
});