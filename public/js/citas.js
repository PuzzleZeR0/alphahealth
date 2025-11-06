document.addEventListener('DOMContentLoaded', async () => {
    
    // --- 1. OBTENER TOKEN ---
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No hay token');
        return;
    }

    // --- 2. VERIFICACIÓN DE PERFIL ---
    let perfilCompleto = false;
    try {
        const profileResponse = await fetch('http://localhost:3003/api/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.fecha_nacimiento && profileData.telefono) {
                perfilCompleto = true;
            }
        }
    } catch (error) {
        console.error("Error al verificar perfil:", error);
    }
    // --- FIN VERIFICACIÓN DE PERFIL ---


    // --- 3. OBTENER ELEMENTOS DEL DOM ---
    const tablaCitas = document.querySelector("#tabla-citas");
    const formCita = document.querySelector("#form-cita");
    const formularioDiv = document.querySelector("#formulario-nueva-cita");
    
    // --- Selectores de botones ---
    const btnCrearCita = document.getElementById('btn-crear-cita');
    const btnCancelarCita = document.querySelector("#btn-cancelar-cita");
    const btnCerrarX = formularioDiv.querySelector('.js-close-modal'); // <-- El botón 'X'
    
    const perfilModal = document.getElementById('perfil-incompleto-modal');
    const btnIrAPerfil = document.getElementById('btn-ir-a-perfil');
    
    let misCitas = []; // Para guardar las citas cargadas

    if (btnIrAPerfil) {
        btnIrAPerfil.addEventListener('click', () => {
            window.location.href = '/views/users.html';
        });
    }

    // --- 4. LÓGICA CONDICIONAL ---
    
    if (perfilCompleto) {
        
        // --- 4.1. Cargar Citas ---
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
                misCitas = await response.json(); 
                renderCitas(misCitas);
            } catch (error) {
                console.error(error.message);
                if (typeof showAlert === 'function') showAlert(error.message, 'error');
            }
        }

        // --- 4.2. Renderizar Citas en la tabla ---
        function renderCitas(citas) {
            if (!tablaCitas) return;
            tablaCitas.innerHTML = '';
            
            if (citas.length === 0) {
                tablaCitas.innerHTML = '<tr><td colspan="6">No tienes citas agendadas.</td></tr>';
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
                
                const tdAcciones = document.createElement('td');
                if (cita.estado === 'Pendiente') {
                    tdAcciones.innerHTML = `
                        <button class="btn-ico btn-reprogramar" data-id="${cita.id}" title="Reprogramar">
                            <i class='bx bx-edit' style="color:var(--color-blue);"></i>
                        </button>
                        <button class="btn-ico-danger btn-cancelar" data-id="${cita.id}" title="Cancelar">
                            <i class='bx bx-trash-alt'></i>
                        </button>
                    `;
                } else {
                    tdAcciones.innerHTML = 'N/A';
                }
                tr.appendChild(tdAcciones);

                tablaCitas.appendChild(tr);
            });
        }

        // --- 4.3. Manejar envío del formulario ---
        if (formCita) {
            formCita.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const fecha = document.getElementById('cita-fecha').value;
                const hora = document.getElementById('cita-hora').value;
                const tratamiento = document.getElementById('cita-tratamiento').value;
                const editingId = formCita.dataset.editingId; 
                
                let url = '/api/citas';
                let method = 'POST';
                let body = { fecha, hora, tratamiento };

                if (editingId) {
                    url = `/api/citas/${editingId}`;
                    method = 'PUT';
                    body.estado = 'Pendiente'; 
                }

                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(body)
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.error || 'Error al guardar la cita');
                    
                    showAlert(editingId ? 'Cita actualizada exitosamente' : 'Cita creada exitosamente', 'success');
                    resetFormulario();
                    formularioDiv.classList.remove('visible');
                    cargarCitas();
                } catch (error) {
                    console.error("--- ERROR AL GUARDAR CITA ---", error.message);
                    if (typeof showAlert === 'function') showAlert(error.message, 'error');
                }
            });
        }

        // --- 4.4. Listeners para ABRIR y CERRAR el modal ---

        // Botón "Crear Cita"
        if (btnCrearCita) {
            btnCrearCita.addEventListener('click', () => {
                resetFormulario(); // Limpia el formulario
                formularioDiv.classList.add('visible'); // Muestra el modal
            });
        }

        // Botón "Cancelar" (rojo, dentro del modal)
        if (btnCancelarCita) {
            btnCancelarCita.addEventListener('click', () => {
                resetFormulario();
                formularioDiv.classList.remove('visible');
            });
        }
        
        // Botón "X" (en la esquina del modal)
        if (btnCerrarX) {
            btnCerrarX.addEventListener('click', () => {
                resetFormulario();
                formularioDiv.classList.remove('visible');
            });
        }
    
        // Clic en el fondo (overlay)
        if (formularioDiv) {
            formularioDiv.addEventListener('click', (event) => {
                if (event.target === formularioDiv) { // Si se hizo clic en el fondo
                    resetFormulario();
                    formularioDiv.classList.remove('visible');
                }
            });
        }
        
        // --- 4.5. Función para resetear el formulario ---
        function resetFormulario() {
            if (formCita) {
                formCita.reset();
                formCita.removeAttribute('data-editing-id');
                formCita.querySelector('button[type="submit"]').textContent = 'Guardar Cita';
                formularioDiv.querySelector('h3').textContent = 'Nueva cita';
            }
        }
        
        // --- 4.6. Listeners para botones de la tabla (Reprogramar/Cancelar) ---
        tablaCitas.addEventListener('click', async (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const citaId = target.dataset.id;
            
            if (target.classList.contains('btn-cancelar')) {
                const confirmed = await showConfirm(
                    `¿Estás seguro de que deseas cancelar la cita ID ${citaId}?`,
                    "Cancelar Cita"
                );
                if (confirmed) {
                    await handleCancelarCita(citaId);
                }
            }
            
            if (target.classList.contains('btn-reprogramar')) {
                handleReprogramarCita(citaId);
            }
        });

        // --- 4.7. Funciones Handler para botones ---
        async function handleCancelarCita(citaId) {
            try {
                const response = await fetch(`/api/citas/${citaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ estado: 'Cancelada' })
                });
                if (!response.ok) throw new Error((await response.json()).error);
                
                showAlert('Cita cancelada exitosamente.', 'success');
                cargarCitas();
            } catch (error) {
                console.error('Error en handleCancelarCita:', error);
                showAlert(error.message, 'error');
            }
        }

        function handleReprogramarCita(citaId) {
            const cita = misCitas.find(c => c.id == citaId);
            if (!cita) {
                showAlert('No se encontraron los datos de la cita.', 'error');
                return;
            }

            document.getElementById('cita-fecha').value = cita.fecha;
            document.getElementById('cita-hora').value = cita.hora;
            document.getElementById('cita-tratamiento').value = cita.tratamiento;

            formCita.dataset.editingId = citaId; 
            formCita.querySelector('button[type="submit"]').textContent = 'Actualizar Cita';
            formularioDiv.querySelector('h3').textContent = `Reprogramar Cita ID: ${citaId}`;

            formularioDiv.classList.add('visible');
        }
        
        // --- 4.8. Carga inicial ---
        cargarCitas();

    } else {
        // --- B. PERFIL INCOMPLETO ---
        console.warn("Perfil incompleto. Bloqueando creación de citas.");
        if (tablaCitas) {
            tablaCitas.innerHTML = '<tr><td colspan="6">Debes completar tu perfil clínico para gestionar tus citas.</td></tr>';
        }
        if (perfilModal) {
            perfilModal.classList.add('visible');
        }
        // Ocultar el botón de crear si el perfil está incompleto
        if (btnCrearCita) {
            btnCrearCita.style.display = 'none';
        }
    }
});