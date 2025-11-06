document.addEventListener('DOMContentLoaded', async () => {
    
    // --- BLOQUE 1: OBTENER TOKEN ---
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No hay token');
        // auth.js (si está importado) se encargará de redirigir si es necesario
        // Si no, la lógica de showAlert en general.js o auth.js lo hará.
        return;
    }

    // --- BLOQUE 2: VERIFICACIÓN DE PERFIL ---
    let perfilCompleto = false;
    try {
        const profileResponse = await fetch('http://localhost:3003/api/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            
            // Verificamos campos clave del perfil clínico
            if (profileData.fecha_nacimiento && 
                profileData.telefono && 
                profileData.domicilio &&
                profileData.contacto_emergencia_nombre) {
                
                perfilCompleto = true;
            }
        } else {
            console.error('No se pudo obtener el perfil del usuario.');
        }
    } catch (error) {
        console.error("Error al verificar perfil:", error);
        if (typeof showAlert === 'function') {
            showAlert('No se pudo verificar tu perfil. Intenta más tarde.', 'error');
        }
        return; 
    }

    // --- 3. OBTENER ELEMENTOS DEL DOM ---
    const tablaCitas = document.querySelector("#tabla-citas");
    const formCita = document.querySelector("#form-cita");
    const formularioDiv = document.querySelector("#formulario-nueva-cita");
    // const btnCrearCita = document.querySelector("#btn-crear-cita");
    const btnCancelarCita = document.querySelector("#btn-cancelar-cita");
    
    // Elementos del modal de perfil incompleto
    const perfilModal = document.getElementById('perfil-incompleto-modal');
    const btnIrAPerfil = document.getElementById('btn-ir-a-perfil');
    
    // Asignar evento al botón "Completar Perfil" del modal
    if (btnIrAPerfil) {
        btnIrAPerfil.addEventListener('click', () => {
            window.location.href = '/views/users.html'; // Redirigir a la página de perfil
        });
    }

    // --- BLOQUE 4: LÓGICA CONDICIONAL ---
    
    if (perfilCompleto) {
        // --- A. PERFIL COMPLETO: Cargar todo normally ---
        
        console.log("Perfil completo. Cargando funcionalidad de citas.");

        // --- 1. Cargar Citas al iniciar ---
        async function cargarCitas() {
            try {
                const response = await fetch('/api/citas', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al cargar las citas');
                }
                const citas = await response.json();
                renderCitas(citas);
            } catch (error) {
                console.error(error.message);
                if (typeof showAlert === 'function') {
                    showAlert(error.message, 'error');
                }
            }
        }

        // --- 2. Renderizar Citas en la tabla ---
        function renderCitas(citas) {
            if (!tablaCitas) return;
            tablaCitas.innerHTML = ''; // Limpiar tabla
            
            if (citas.length === 0) {
                tablaCitas.innerHTML = '<tr><td colspan="5">No tienes citas agendadas.</td></tr>';
                return;
            }

            citas.forEach(cita => {
                const tr = document.createElement('tr');
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
        if (formCita) {
            formCita.addEventListener('submit', async (e) => {
                console.log("¡Botón 'Guardar Cita' clickeado! Iniciando envío..."); // DEBUG
                
                e.preventDefault();
                
                const fecha = document.getElementById('cita-fecha').value;
                const hora = document.getElementById('cita-hora').value;
                const tratamiento = document.getElementById('cita-tratamiento').value;

                console.log("Datos a enviar:", { fecha, hora, tratamiento }); // DEBUG

                try {
                    const response = await fetch('/api/citas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ fecha, hora, tratamiento })
                    });

                    const result = await response.json();
                    console.log("Respuesta del servidor:", result); // DEBUG

                    if (!response.ok) {
                        throw new Error(result.error || 'Error al crear la cita');
                    }
                    
                    if (typeof showAlert === 'function') {
                        showAlert('Cita creada exitosamente', 'success');
                    }
                    
                    formCita.reset();
                    formularioDiv.classList.add('hidden');
                    cargarCitas(); // Recargar la lista de citas

                } catch (error) {
                    console.error("--- ERROR AL CREAR CITA ---", error.message); // DEBUG
                    if (typeof showAlert === 'function') {
                        showAlert(error.message, 'error');
                    }
                }
            });
        }

        // --- 4. Mostrar/Ocultar formulario ---
        // if (btnCrearCita) {
        //     btnCrearCita.style.display = 'inline-block'; // Asegurarse que el botón sea visible
        //     btnCrearCita.addEventListener('click', () => {
        //         if (formularioDiv) formularioDiv.classList.remove('hidden');
        //     });
        // }

        if (btnCancelarCita) {
            btnCancelarCita.addEventListener('click', () => {
                if (formularioDiv) formularioDiv.classList.add('hidden');
                if (formCita) formCita.reset();
            });
        }
        
        // --- Carga inicial ---
        cargarCitas();

    } else {
        // --- B. PERFIL INCOMPLETO: Bloquear funcionalidad ---
        
        console.warn("Perfil incompleto. Bloqueando creación de citas.");

        // Ocultar el botón de crear cita
        // if (btnCrearCita) {
        //     btnCrearCita.style.display = 'none';
        // }
        // Ocultar el formulario si estuviera abierto
        if (formularioDiv) {
            formularioDiv.classList.add('hidden');
        }
        // Mostrar un mensaje en la tabla
        if (tablaCitas) {
            tablaCitas.innerHTML = '<tr><td colspan="5">Debes completar tu perfil clínico para gestionar tus citas.</td></tr>';
        }

        // Mostrar el modal de advertencia
        if (perfilModal) {
            perfilModal.classList.add('visible');
        }
    }

}); // <-- FIN DEL DOMContentLoaded