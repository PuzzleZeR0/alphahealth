// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/public/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Si no hay token y no estamos en la página de login, redirigir a login
    if (!token && window.location.pathname !== '/login') {
        // Guardamos la página que el usuario intentaba visitar
        localStorage.setItem('redirectUrl', window.location.pathname);
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = '/login';
    }
});