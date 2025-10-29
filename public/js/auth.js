// public/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Si no hay token y no estamos en la página de login, redirigir a login
    // Asegúrate de que '/login' sea la ruta correcta a tu página HTML de login
    if (!token && !window.location.pathname.endsWith('/login.html') && window.location.pathname !== '/login') {

        // Guardamos la página que el usuario intentaba visitar
        localStorage.setItem('redirectUrl', window.location.pathname + window.location.search); // Guarda también los parámetros si los hay

        // Mostrar alerta (asegúrate que showAlert esté disponible globalmente)
        if (typeof showAlert === 'function') {
             // Mostramos la alerta por 2 segundos
             showAlert('Debes iniciar sesión para acceder a esta página.', 'warning', 2000);
        } else {
             alert('Debes iniciar sesión para acceder a esta página.'); // Fallback
        }

        // --- RETRASAR LA REDIRECCIÓN ---
        setTimeout(() => {
             // Redirigir al usuario a la página de login DESPUÉS de un tiempo
             window.location.href = '/login'; // O '/views/test/login.html' si esa es la ruta directa
        }, 1500); // Espera 1.5 segundos antes de redirigir

    }
});