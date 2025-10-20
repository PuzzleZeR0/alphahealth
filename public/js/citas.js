// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/public/js/citas.js
document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('token');
    const tablaCitas = document.querySelector("#tabla-citas");
    const formCita = document.querySelector("#form-cita");
    const formularioDiv = document.querySelector("#formulario-nueva-cita");
    const btnCrearCita = document.querySelector("#btn-crear-cita");
    const btnCancelarCita = document.querySelector("#btn-cancelar-cita");

    // --- 1. Cargar Citas al iniciar ---
    async function cargarCitas() {
        if (!token) {
            console.error('No hay token');
            return;
        }

        try {
            const response = await fetch('/api/citas', {
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
            alert('No se pudieron cargar las citas.');
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
        // Obtenemos el texto del tratamiento, no el valor
        const tratamiento = tratamientoSelect.options[tratamientoSelect.selectedIndex].text;

        try {
            const response = await fetch('/api/citas', {
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

            alert('Cita creada exitosamente');
            formCita.reset();
            formularioDiv.classList.add('hidden');
            cargarCitas(); // Recargar la tabla

        } catch (error) {
            console.error(error.message);
            alert(error.message);
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
});