// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./src/infrastructure/database.js');
const authRoutes = require('./src/adapters/in/web/auth.routes.js');
const authMiddleware = require('./src/infrastructure/middleware/auth.middleware.js');

const path = require('path'); // Asegúrate de importar el módulo 'path'
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
// Conexión a la base de datos
connectDB();

// Rutas
app.use('/auth', authRoutes);

// Ejemplo de ruta protegida
app.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ 
        message: 'Esta es una ruta protegida. ¡Has accedido con éxito!',
        user: req.user
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});