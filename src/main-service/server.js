// puzzlezer0/alphahealth/src/main-service/server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Asegúrate de que esté importado
const path = require('path');
const { connectDB } = require('./infrastructure/database.js');

// --- Importar Rutas y Middleware ---
const citasRoutes = require('./adapters/in/web/citas.routes.js');
const authMiddleware = require('./infrastructure/middleware/auth.middleware.js');
// --- roles middleware ---
const adminMiddleware = require('./infrastructure/middleware/admin.middleware.js');

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
        
        // 1. Para permitir la conexión al servicio de usuarios (login, perfil)
        // 2. Y para permitir la conexión a animatedicons.co (para cargar el JSON)
        "connect-src": ["'self'", "http://localhost:3003", "https://animatedicons.co"], 
        
        // 3. Para permitir los scripts de tu app, animatedicons, y lottie (cloudflare)
        "script-src": ["'self'", "https://animatedicons.co", "https://cdnjs.cloudflare.com"]
      },
    },
  })
);
// --- FIN DE LA CONFIGURACIÓN DE HELMET ---
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

// 2. Vistas de Admin (Protegidas)
// Solo los admin pueden ACCEDER a estas vistas
app.get('/views/historial.html', authMiddleware, adminMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'views', 'historial.html'));
});
app.get('/views/pedidos.html', authMiddleware, adminMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'views', 'pedidos.html'));
});

// 3. Vistas de Usuario (Solo requieren login)
// Asegúrate de que las rutas que CUALQUIER usuario logueado puede ver estén aquí
app.get('/views/citas.html', authMiddleware, (req, res) => {
     res.sendFile(path.join(__dirname, '../../public', 'views', 'citas.html'));
});
app.get('/views/cotizar.html', authMiddleware, (req, res) => {
     res.sendFile(path.join(__dirname, '../../public', 'views', 'cotizar.html'));
});
app.get('/views/users.html', authMiddleware, (req, res) => {
     res.sendFile(path.join(__dirname, '../../public', 'views', 'users.html'));
});
// (Añade más vistas de usuario aquí si es necesario)

app.listen(PORT, () => {
    console.log(`Servicio Principal corriendo en http://localhost:${PORT}`);
});