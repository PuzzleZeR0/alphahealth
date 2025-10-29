// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/public/js/inicio.js
document.addEventListener('DOMContentLoaded', () => {
    const agendarCitaButton = document.getElementById('btn-agendar-cita');

    if (agendarCitaButton) {
        agendarCitaButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir el comportamiento por defecto del enlace

            const token = localStorage.getItem('token');

            if (token) {
                // Si el usuario tiene sesión iniciada, lo redirigimos a la página de citas
                window.location.href = '/views/citas.html';
            } else {
                // Si no, le pedimos que inicie sesión
                showAlert('Por favor, inicia sesión para agendar una cita.', 'warning');
                window.location.href = '/login';
            }
        });
    }

    // Puedes agregar aquí la misma lógica para otros botones del menú lateral si es necesario
    const navLinks = document.querySelectorAll('.navegation a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const destination = this.href;

            if (token) {
                window.location.href = destination;
            } else {
                showAlert('Debes iniciar sesión para acceder a esta sección.', 'warning');
                window.location.href = '/login';
            }
        });
    });
});