document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("No hay token, redirigiendo...");
        // Asumimos que auth.js o general.js manejan la redirección
        return;
    }

    const tablaBody = document.querySelector("#tabla-historial");
    const buscador = document.querySelector("#buscador");
    let todasLasCitas = []; // Almacenamos todas las citas aquí para filtrar

    /**
     * Carga todas las citas desde el endpoint de admin
     */
    async function cargarHistorialCitas() {
        if (!tablaBody) {
            console.error("Error: No se encontró el elemento #tabla-historial");
            return;
        }
        
        try {
            const response = await fetch('/api/citas/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Error al cargar el historial de citas');
            }

            todasLasCitas = await response.json();
            
            if (todasLasCitas.length === 0) {
                 tablaBody.innerHTML = '<tr><td colspan="6">No hay citas registradas en el sistema.</td></tr>';
            } else {
                renderCitas(todasLasCitas);
            }
            
        } catch (error) {
            console.error("Error en cargarHistorialCitas:", error);
            tablaBody.innerHTML = `<tr><td colspan="6">Error al cargar: ${error.message}</td></tr>`;
        }
    }

    /**
     * Renderiza las citas en la tabla
     * @param {Array} citas - El array de citas a mostrar
     */
    function renderCitas(citas) {
        tablaBody.innerHTML = ''; // Limpiar tabla
        
        if (citas.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="6">No se encontraron citas con ese criterio.</td></tr>';
            return;
        }

        citas.forEach(cita => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${cita.id}</td>
                <td>${cita.nombre_paciente || 'Usuario no encontrado'}</td>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td>${cita.tratamiento}</td>
                <td>${cita.estado}</td>
            `;
            tablaBody.appendChild(tr);
        });
    }

    /**
     * Filtra las citas basándose en el término de búsqueda
     */
    function filtrarCitas() {
        const termino = buscador.value.trim().toLowerCase();
        
        if (termino === '') {
            renderCitas(todasLasCitas); // Mostrar todo si no hay búsqueda
            return;
        }

        const citasFiltradas = todasLasCitas.filter(cita => {
            const idCita = String(cita.id).toLowerCase();
            const nombrePaciente = (cita.nombre_paciente || '').toLowerCase();
            
            return idCita.includes(termino) || nombrePaciente.includes(termino);
        });

        renderCitas(citasFiltradas);
    }

    // --- Event Listeners ---
    if (buscador) {
        buscador.addEventListener("input", filtrarCitas);
    }

    // Carga inicial de datos
    cargarHistorialCitas();
});