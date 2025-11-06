// src/user-service/infrastructure/middleware/admin.middleware.js
// (Este es idéntico al que tienes en main-service)

const adminMiddleware = (req, res, next) => {
    // Este middleware DEBE ejecutarse DESPUÉS de authMiddleware
    if (!req.user) {
        return res.status(401).json({ message: 'Acceso denegado.' });
    }

    if (req.user.rol !== 'admin') {
        // Si no es admin, negamos el acceso
        return res.status(403).json({ message: 'Acceso denegado. Requiere permisos de administrador.' });
    }

    // Si es admin, continuamos
    next();
};

module.exports = adminMiddleware;