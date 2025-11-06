// public/js/pedidos.js
// Lógica reescrita para "Historial Clínico"

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // general.js o auth.js se encargarán de la redirección
        console.error("Acceso denegado. No hay token.");
        return;
    }

    // --- 1. Selectores del DOM ---
    const tablaBody = document.getElementById("tabla-historial-clinico");
    const buscador = document.getElementById("input-search-citas"); // ID del buscador en pedidos.html
    const modal = document.getElementById("historial-clinico-modal");
    const modalPacienteNombre = modal.querySelector(".h1-paciente");
    const modalPacienteDetalles = modal.querySelector(".p-paciente");

    let allPatientsData = []; // Caché para guardar los datos y poder filtrar

    // --- 2. Función para Cargar Pacientes ---
    async function cargarPacientes() {
        if (!tablaBody) return;
        tablaBody.innerHTML = '<tr><td colspan="3">Cargando pacientes...</td></tr>';

        try {
            const response = await fetch('http://localhost:3003/api/profiles/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Error al cargar pacientes');
            }

            allPatientsData = await response.json();
            renderTabla(allPatientsData);

        } catch (error) {
            console.error("Error cargando pacientes:", error);
            tablaBody.innerHTML = `<tr><td colspan="3">Error: ${error.message}</td></tr>`;
        }
    }

    // --- 3. Función para Renderizar la Tabla ---
    function renderTabla(pacientes) {
        tablaBody.innerHTML = ""; // Limpiar tabla
        
        // Quitar los <tr> de ejemplo
        const ejemplos = tablaBody.querySelectorAll('tr');
        ejemplos.forEach(ej => ej.remove());


        if (pacientes.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="3">No se encontraron pacientes.</td></tr>';
            return;
        }

        pacientes.forEach(paciente => {
            const tr = document.createElement("tr");
            tr.dataset.userId = paciente.id; // Guardamos el ID en el <tr>
            tr.style.cursor = "pointer";
            tr.innerHTML = `
                <td>${String(paciente.id).padStart(3, '0')}</td>
                <td>${paciente.nombre}</td>
                <td>${paciente.telefono || 'No registrado'}</td>
            `;
            tablaBody.appendChild(tr);
        });
    }

    // --- 4. Función para Poblar y Mostrar el Modal ---
    function mostrarModalPaciente(event) {
        const tr = event.target.closest('tr');
        if (!tr || !tr.dataset.userId) return; // No se hizo clic en una fila válida

        const userId = parseInt(tr.dataset.userId, 10);
        const paciente = allPatientsData.find(p => p.id === userId);

        if (!paciente) {
            console.error("No se encontraron datos para el paciente ID:", userId);
            return;
        }

        // Poblar el modal
        modalPacienteNombre.innerHTML = paciente.nombre || 'Nombre no disponible';
        
        // Construir los detalles
        let detallesHtml = `
            <p><strong>Email:</strong> ${paciente.email || 'No registrado'}</p>
            <p><strong>Teléfono:</strong> ${paciente.telefono || 'No registrado'}</p>
            <p><strong>Domicilio:</strong> ${paciente.domicilio || 'No registrado'}</p>
            <p><strong>Edad:</strong> ${paciente.edad || 'No registrada'}</p>
            <p><strong>Sexo:</strong> ${paciente.sexo || 'No registrado'}</p>
        `;

        // --- Lógica Condicional para Enfermedades ---
        // Solo se añaden los <p> si el valor es 1 (Sí)
        
        let padecimientos = [];
        if (paciente.diabetes_pers === 1) padecimientos.push('Diabetes');
        if (paciente.hipertension_pers === 1) padecimientos.push('Hipertensión');
        if (paciente.cardiacas_pers === 1) padecimientos.push('Problemas Cardíacos');
        if (paciente.fiebre_reumatica_pers === 1) padecimientos.push('Fiebre Reumática');
        if (paciente.tiroides_pers === 1) padecimientos.push('Problemas de Tiroides');
        if (paciente.asma_pers === 1) padecimientos.push('Asma');
        if (paciente.renales_pers === 1) padecimientos.push('Problemas Renales');
        if (paciente.gastritis_pers === 1) padecimientos.push('Gastritis');

        if (padecimientos.length > 0) {
            detallesHtml += `<hr><p><strong>Padecimientos Personales:</strong></p>`;
            padecimientos.forEach(pad => {
                // Usamos un estilo en línea para destacarlos
                detallesHtml += `<p style="color: #f0a000; font-weight: bold;">- ${pad}</p>`;
            });
        } else {
             detallesHtml += `<hr><p><strong>Padecimientos Personales:</strong> Ninguno registrado.</p>`;
        }

        modalPacienteDetalles.innerHTML = detallesHtml;

        // Mostrar el modal
        modal.classList.add('visible');
    }

    // --- 5. Función de Búsqueda ---
    function filtrarPacientes() {
        const termino = buscador.value.trim().toLowerCase();
        if (termino === '') {
            renderTabla(allPatientsData);
            return;
        }

        const filtrados = allPatientsData.filter(paciente => {
            const nombre = (paciente.nombre || '').toLowerCase();
            const email = (paciente.email || '').toLowerCase();
            const telefono = (paciente.telefono || '').toLowerCase();
            const id = String(paciente.id);

            return nombre.includes(termino) || email.includes(termino) || telefono.includes(termino) || id.includes(termino);
        });

        renderTabla(filtrados);
    }

    // --- 6. Asignar Eventos ---
    
    // Clic en la tabla (delegación)
    tablaBody.addEventListener('click', mostrarModalPaciente);

    // Buscador
    if (buscador) {
        buscador.addEventListener('input', filtrarPacientes);
    }

    // Carga inicial
    cargarPacientes();
});