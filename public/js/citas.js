document.addEventListener('DOMContentLoaded', async () => { // <-- Hacemos la función async

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No hay token');
        // auth.js se encargará de redirigir si es necesario
        return;
    }

    // --- 1. VERIFICACIÓN DE PERFIL ANTES DE CARGAR NADA ---
    let perfilCompleto = false;
    try {
        const profileResponse = await fetch('http://localhost:3003/api/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            
            // --- ¡IMPORTANTE! Define aquí qué campos son OBLIGATORIOS ---
            // Revisa que los campos existan (no sean null o string vacío)
            // Puedes añadir más campos si son críticos (ej: antecedentes médicos)
            if (profileData.fecha_nacimiento && 
                profileData.telefono && 
                profileData.domicilio &&
                profileData.contacto_emergencia_nombre) {
                
                perfilCompleto = true;
            }
        } else {
            // Si falla la obtención del perfil (ej. 404), asumimos que está incompleto
            console.error('No se pudo obtener el perfil del usuario.');
        }
    } catch (error) {
        console.error("Error al verificar perfil:", error);
        showAlert('No se pudo verificar tu perfil. Intenta más tarde.', 'error');
        return; // Detener la ejecución si no se puede verificar
    }

    // --- 2. OBTENER ELEMENTOS DEL DOM ---
    const tablaCitas = document.querySelector("#tabla-citas");
    const formCita = document.querySelector("#form-cita");
    const formularioDiv = document.querySelector("#formulario-nueva-cita");
    const btnCrearCita = document.querySelector("#btn-crear-cita");
    const btnCancelarCita = document.querySelector("#btn-cancelar-cita");
    
    // Elementos del nuevo modal
    const perfilModal = document.getElementById('perfil-incompleto-modal');
    const btnIrAPerfil = document.getElementById('btn-ir-a-perfil');
    
    // Asignar evento al botón "Completar Perfil" del modal
    if (btnIrAPerfil) {
        btnIrAPerfil.addEventListener('click', () => {
            window.location.href = '/views/users.html'; // Redirigir a la página de perfil
        });
    }

    // --- 3. LÓGICA CONDICIONAL BASADA EN EL PERFIL ---

    if (perfilCompleto) {
        // --- A. PERFIL COMPLETO: Cargar todo normalmente ---
        
        console.log("Perfil completo. Cargando funcionalidad de citas.");

        // --- 1. Cargar Citas al iniciar ---
        async function cargarCitas() {
            try {
                const response = await fetch('/api/citas', { // Llama al main-service (puerto 5555)
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener las citas');
                }

                const citas = await response.json();
                renderCitas(citas);

            } catch (error) {
                console.error(error.message);
                if (tablaCitas) tablaCitas.innerHTML = '<tr><td colspan="5">No se pudieron cargar las citas.</td></tr>';
            }
        }

        // --- 2. Renderizar Citas en la tabla ---
        function renderCitas(citas) {
            tablaCitas.innerHTML = ""; // Limpiar tabla
            if (citas.length === 0) {
                tablaCitas.innerHTML = '<tr><td colspan="5">No tienes citas agendadas.</td></tr>';
                return;
            }

            citas.forEach(cita => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${cita.id}</td>
                    <td>${cita.fecha}</td>
                    <td>${cita.hora}</td>
                    <td>${cita.tratamiento}</td>
                    <td>${cita.estado}</td>
                `;
                tablaCitas.appendChild(tr);
            });
        }

        // --- 3. Manejar envío del formulario ---
        formCita.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fecha = document.querySelector("#cita-fecha").value;
            const hora = document.querySelector("#cita-hora").value;
            const tratamientoSelect = document.querySelector("#cita-tratamiento");
            const tratamiento = tratamientoSelect.options[tratamientoSelect.selectedIndex].text;

            try {
                const response = await fetch('/api/citas', { // Llama al main-service (puerto 5555)
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ fecha, hora, tratamiento })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error al crear la cita');
                }

                showAlert('Cita creada exitosamente', 'success');
                formCita.reset();
                formularioDiv.classList.add('hidden');
                cargarCitas(); // Recargar la tabla

            } catch (error) {
                console.error(error.message);
                showAlert(error.message, 'error');
            }
        });

        // --- 4. Mostrar/Ocultar formulario ---
        btnCrearCita.addEventListener('click', () => {
            formularioDiv.classList.remove('hidden');
        });

        btnCancelarCita.addEventListener('click', () => {
            formularioDiv.classList.add('hidden');
            formCita.reset();
        });

        // --- Carga inicial ---
        cargarCitas();

    } else {
        // --- B. PERFIL INCOMPLETO: Bloquear funcionalidad ---
        
        console.warn("Perfil incompleto. Bloqueando creación de citas.");

        // Mostrar mensaje en la tabla
        if (tablaCitas) {
            tablaCitas.innerHTML = '<tr><td colspan="5">Debes completar tu perfil clínico para poder agendar citas.</td></tr>';
        }
        
        // Modificar el botón "Crear Cita" para que abra el modal de aviso
        if (btnCrearCita) {
            btnCrearCita.addEventListener('click', () => {
                if (perfilModal) {
                    perfilModal.classList.add('visible'); // Usa la clase 'visible' de general.js
                } else {
                    // Fallback si el modal no existe
                    showAlert('Debes completar tu perfil antes de agendar una cita.', 'warning');
                }
            });
        }
        
        // Opcional: Mostrar el aviso inmediatamente al cargar la página
        // if (perfilModal) {
        //     perfilModal.classList.add('visible');
        // }
    }

}); // <-- FIN DEL DOMContentLoaded