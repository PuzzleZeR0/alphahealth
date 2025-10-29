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

            if (typeof showAlert === 'function') {
                 showAlert('Has cerrado la sesión. Redirigiendo...', 'info', 2000);
             } else {
                 alert('Has cerrado la sesión.'); // Fallback si showAlert no está lista
             }
             
            setTimeout(() => {
              // Redirigir al usuario a la página de inicio DESPUÉS de un tiempo
              window.location.href = '/';
         }, 1500); // Espera 1500 ms (1.5 segundos) antes de redirigir

            
        });
    }

    // --- LÓGICA DE AVISOS ---


}); // <-- FIN DEL DOMContentLoaded

    // --- LÓGICA PARA MOSTRAR ALERTAS PERSONALIZADAS ---

/**
 * Muestra una alerta personalizada en la esquina superior derecha.
    * @param {string} message - El mensaje a mostrar.
    * @param {string} type - El tipo de alerta ('success', 'info', 'warning', 'error'). Por defecto 'info'.
    * @param {number} duration - Duración en milisegundos antes de desaparecer. Por defecto 3000ms (3 segundos).
    */
    function showAlert(message, type = 'info', duration = 3000) {
        // Asegura que el contenedor exista, si no, lo crea
        let container = document.getElementById('alert-container-dynamic');
        if (!container) {
            container = document.createElement('div');
            container.id = 'alert-container-dynamic';
            // Estilos para posicionar el contenedor
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '2000'; // Asegura que esté por encima de otros elementos
            container.style.width = 'auto'; // Ajusta al contenido
            container.style.maxWidth = '400px'; // Máximo ancho
            document.body.appendChild(container);
        }

        // Crea los elementos de la alerta
        const alertDiv = document.createElement('div');
        alertDiv.role = 'alert';
        // Aplica clases base y la específica del tipo
        alertDiv.className = `alert alert-${type}`; // Asegúrate que tus clases CSS coincidan (alert-success, alert-info, etc.)
        // Estilos adicionales por si no están en masterStyle.css
        alertDiv.style.padding = '0.75rem 1rem';
        alertDiv.style.marginBottom = '0.75rem'; // Espacio entre alertas
        alertDiv.style.borderRadius = '10px';
        alertDiv.style.display = 'flex';
        alertDiv.style.alignItems = 'center';
        alertDiv.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; // Sombra suave
        alertDiv.style.opacity = '0'; // Empieza invisible para la animación
        alertDiv.style.transition = 'opacity 0.5s ease';


        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'alert-icon-wrapper'; // Necesitas esta clase en tu CSS
        // Estilos por si acaso
        iconWrapper.style.width = '1.4rem';
        iconWrapper.style.height = '1.4rem';
        iconWrapper.style.borderRadius = '50%';
        iconWrapper.style.display = 'flex';
        iconWrapper.style.alignItems = 'center';
        iconWrapper.style.justifyContent = 'center';
        iconWrapper.style.flexShrink = '0';
        iconWrapper.style.marginRight = '0.75rem';

        const icon = document.createElement('i');
        // Elige el icono según el tipo
        let iconClass = 'bx bx-info-circle'; // Icono por defecto
        if (type === 'success') iconClass = 'bx bx-check-circle';
        if (type === 'warning') iconClass = 'bx bx-error-circle';
        if (type === 'error') iconClass = 'bx bx-x-circle';
        icon.className = `${iconClass} alert-icon`; // Necesitas alert-icon en tu CSS
        icon.style.fontSize = '1.5rem'; // Tamaño del icono


        const messageP = document.createElement('p');
        messageP.className = 'alert-message'; // Necesitas alert-message en tu CSS
        messageP.textContent = message;
        // Estilos por si acaso
        messageP.style.fontSize = '0.95rem';
        messageP.style.fontWeight = '600';
        messageP.style.lineHeight = '1.4'; // Ajuste para mejor lectura
        messageP.style.margin = '0'; // Resetear margen


        // Ensambla la alerta
        iconWrapper.appendChild(icon);
        alertDiv.appendChild(iconWrapper);
        alertDiv.appendChild(messageP);

        // Añade la alerta al contenedor
        container.appendChild(alertDiv);

        // Forzar reflow para que la transición funcione
        void alertDiv.offsetWidth;

        // Hacer visible la alerta
        alertDiv.style.opacity = '1';


        // Elimina la alerta después de la duración especificada
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            // Espera a que termine la transición de opacidad antes de eliminar
            alertDiv.addEventListener('transitionend', () => {
                if (alertDiv.parentNode) { // Comprueba si todavía está en el DOM
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            });
        }, duration);
    }

// --- FIN LÓGICA ALERTAS ---
