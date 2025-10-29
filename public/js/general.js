// Espera a que la página cargue por completo
document.addEventListener("DOMContentLoaded", () => {

    // --- LÓGICA DE LA BARRA LATERAL Y RESPONSIVE ---
    
    const cloud = document.getElementById("icloud");
    const barraLateral = document.querySelector(".barraLateral");
    const spans = document.querySelectorAll("span");
    const main = document.querySelector("main");

    // Función para contraer/expandir la barra
    // (La definimos aquí dentro para que acceda a las variables de arriba)
    function toggleBarra() {
        // Comprobamos si los elementos existen antes de usarlos
        if (barraLateral) {
            barraLateral.classList.toggle("miniBarra");
        }
        if (main) {
            main.classList.toggle("min-main");
        }
        if (cloud) {
            cloud.classList.toggle("bee-dif");
        }
        if (spans) {
            spans.forEach((span) => {
                span.classList.toggle("oculto");
            });
        }
    }

    // Evento click manual (solo si 'cloud' existe)
    if (cloud) {
        cloud.addEventListener("click", toggleBarra);
    }

    // Detectar cambios en el tamaño de la pantalla
    const mediaQuery = window.matchMedia("(max-width: 870px)");

    function handleResponsive(e) {
        // Asegurarse de que la barra lateral existe en esta página
        if (!barraLateral) {
            return;
        }

        if (e.matches) {
            // Pantalla < 870px: Contraer barra
            if (!barraLateral.classList.contains("miniBarra")) {
                toggleBarra(); 
            }
        } else {
            // Pantalla > 870px: Expandir barra
            if (barraLateral.classList.contains("miniBarra")) {
                toggleBarra();
            }
        }
    }

    // Ejecutar al cargar y al cambiar el tamaño
    mediaQuery.addListener(handleResponsive);
    handleResponsive(mediaQuery); // Verificar estado inicial

    
    // --- LÓGICA REUTILIZABLE DEL MODAL ---
    
    const openModalButtons = document.querySelectorAll('.js-open-modal');
    const closeModalButtons = document.querySelectorAll('.js-close-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.target; // ej. "#edit-profile-modal"
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.classList.add('visible');
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('visible');
            }
        });
    });

    modalOverlays.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('visible');
            }
        });
    });


    // --- LÓGICA DE CERRAR SESIÓN ---
    
    const logoutButton = document.querySelector('.btn-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Eliminar el token de localStorage
            localStorage.removeItem('token');
            // Opcional: Limpiar cualquier otra información de sesión
            localStorage.removeItem('redirectUrl');

            alert('Has cerrado la sesión.');
            // Redirigir al usuario a la página de inicio
            window.location.href = '/';
        });
    }

}); // <-- FIN DEL DOMContentLoaded