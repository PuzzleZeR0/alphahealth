// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/public/js/inicio.js
document.addEventListener('DOMContentLoaded', () => {
    const agendarCitaButton = document.getElementById('btn-agendar-cita');

    if (agendarCitaButton) {
        agendarCitaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (token) {
                window.location.href = '/views/citas.html';
            } else {
                 // Mostrar alerta
                 if (typeof showAlert === 'function') {
                      showAlert('Por favor, inicia sesión para agendar una cita.', 'warning', 2000);
                 } else {
                      alert('Por favor, inicia sesión para agendar una cita.');
                 }
                 // Retrasar redirección
                 setTimeout(() => {
                      window.location.href = '/login'; // O la ruta correcta a tu login
                 }, 1500);
            }
        });
    }

    // Puedes agregar aquí la misma lógica para otros botones del menú lateral si es necesario
    const navLinks = document.querySelectorAll('.navegation a');
    navLinks.forEach(link => {
        link.addEventListener('click', function handleNavClick(e) { // Damos un nombre a la función
            e.preventDefault(); // Prevenir navegación inmediata
            const token = localStorage.getItem('token');
            const destination = this.href; // El href original del enlace

            if (token) {
                window.location.href = destination;
            } else {
                // Si NO hay token, muestra alerta y retrasa redirección
                if (typeof showAlert === 'function') {
                     showAlert('Debes iniciar sesión para acceder a esta sección.', 'warning', 2000);
                } else {
                     alert('Debes iniciar sesión para acceder a esta sección.');
                }
                // --- RETRASAR LA REDIRECCIÓN ---
                setTimeout(() => {
                     window.location.href = '/login'; // O la ruta correcta a tu login
                }, 1500); // Espera 1.5 segundos
            }
        });
    });
});