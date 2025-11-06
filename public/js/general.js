/**
 * Decodifica un JWT (token) para obtener su payload.
 * @param {string} token El JWT
 * @returns {object | null} El payload del token o null si es inválido.
 */
function parseJwt(token) {
    if (!token) {
        console.log("parseJwt: No se proporcionó token.");
        return null;
    }
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) {
            console.error("parseJwt: Token inválido (no tiene payload).");
            return null;
        }

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Esta es la forma robusta de decodificar Base64 a UTF-8
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar el token:", e);
        return null;
    }
}

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

    const tablaHistorial = document.getElementById('tabla-historial-clinico');
    const historialModal = document.getElementById('historial-clinico-modal');

    // Comprueba que ambos elementos existan en esta página
    if (tablaHistorial && historialModal) {
        
        const modalContent = historialModal.querySelector('#card-2');
        
        tablaHistorial.addEventListener('click', (event) => {
            const clickedRow = event.target.closest('tr');
            
            if (clickedRow) {
                // Obtenemos datos de la fila
                const id = clickedRow.cells[0].textContent;
                const paciente = clickedRow.cells[1].textContent;
                const contacto = clickedRow.cells[2].textContent;
                
                // Poblamos el modal
                if(modalContent) {
                    modalContent.innerHTML = `
                        <h2>Historial de: ${paciente}</h2>
                        <hr>
                        <p><strong>ID Paciente:</strong> ${id}</p>
                        <p><strong>Contacto:</strong> ${contacto}</p>
                        <p>...</p>
                        <p><i>(Aquí se cargaría el resto de la info del historial...)</i></p>
                    `;
                }
                
                // Mostramos el modal
                historialModal.classList.add('visible');
            }
        });
    }

    // --- NUEVA LÓGICA PARA GESTIONAR ROLES ---
    function gestionarVisibilidadAdmin() {
        console.log("Iniciando gestionarVisibilidadAdmin..."); // DEBUG
        const token = localStorage.getItem('token');

        const payload = parseJwt(token); 
        console.log("Payload del token:", payload); // DEBUG

        const esAdmin = payload && payload.rol === 'admin';
        console.log("¿Es Admin?:", esAdmin); // DEBUG

        // Seleccionamos los enlaces por su ID
        const linkHistorial = document.getElementById('historial');
        const linkPedidos = document.getElementById('pedidos'); // Este es 'Historial clinico'

        if (esAdmin) {
        // ¡ES ADMIN! Nos aseguramos de que los vea.
        console.log("Usuario es admin. Mostrando enlaces."); // DEBUG
        if (linkHistorial) {
            linkHistorial.style.display = 'flex'; // Usamos 'flex' porque así está en tu CSS
        }
        if (linkPedidos) {
            linkPedidos.style.display = 'flex';
        }
    } else {
        // NO ES ADMIN (o no está logueado, o payload falló)
        console.log("Usuario NO es admin. Ocultando enlaces."); // DEBUG
        if (linkHistorial) {
            linkHistorial.style.display = 'none';
        }
        if (linkPedidos) {
            linkPedidos.style.display = 'none';
        }
    }
        // Si ES admin, no hacemos nada (se mostrarán por defecto)
    }
    
    // Llamamos a la nueva función al cargar la página
    gestionarVisibilidadAdmin();
    // --- FIN DE LA NUEVA LÓGICA ---

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
function showAlert(message, type = 'info', duration = 5000) {
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
    // ESTO ES LO ÚNICO QUE NECESITAS. LAS CLASES HACEN TODO EL TRABAJO.
    alertDiv.className = `alert alert-${type}`; 
    
    // Estilos para la animación de entrada/salida (los únicos que dejamos)
    alertDiv.style.opacity = '0'; 
    alertDiv.style.transition = 'opacity 0.5s ease';
    alertDiv.style.marginBottom = '0.75rem'; // Espacio entre alertas


    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'alert-icon-wrapper'; // Clase del CSS

    const icon = document.createElement('i');
    // Elige el icono según el tipo
    let iconClass = 'bx bx-info-circle bx-flashing'; // Icono por defecto
    if (type === 'success') iconClass = 'bx bx-info-circle bx-flashing';
    if (type === 'warning') iconClass = 'bx bx-info-circle bx-flashing';
    if (type === 'error') iconClass = 'bx bx-info-circle bx-flashing';
    icon.className = `${iconClass} alert-icon`; // Clases del CSS


    const messageP = document.createElement('p');
    messageP.className = 'alert-message'; // Clase del CSS
    messageP.textContent = message;
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
