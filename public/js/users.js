document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const modal = document.getElementById('edit-profile-modal');
    const btnGuardarPerfil = document.getElementById('btn-guardar-perfil');
    const btnCancelar = modal.querySelector('.js-close-modal.btn-danger'); // Botón Cancelar del modal

    // --- Función para cargar datos del perfil ---
    async function cargarPerfil() {
        if (!token) return; // No hacer nada si no hay token

        try {
            const response = await fetch('http://localhost:3003/api/profile', { // <-- Cambiar URL
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cargar el perfil');
            }

            const profileData = await response.json();
            llenarFormulario(profileData);
            // También podrías llenar los campos de la vista principal (fuera del modal) aquí
            document.getElementById('UsuarioBD').textContent = profileData.nombre || 'No disponible'; // Asumiendo que 'nombre' viene del perfil o se añade en el backend
            document.getElementById('EmailBD').textContent = profileData.email || 'No disponible'; // Asumiendo que 'email' viene del perfil o se añade en el backend
            document.getElementById('contacto-emergencia-display').textContent = // Necesitarás un ID en el label fuera del modal
                profileData.contacto_emergencia_nombre ? `${profileData.contacto_emergencia_nombre} (${profileData.contacto_emergencia_numero})` : 'No especificado';


        } catch (error) {
            console.error('Error cargando perfil:', error);
            showAlert(`Error al cargar el perfil: ${error.message}`, 'error');
        }
    }

    // --- Función para llenar el formulario con datos existentes ---
    function llenarFormulario(data) {
    // Ficha de identificación
    document.getElementById('nombreInput').value = data.nombre || '';
    // --- USAR IDs ---
    document.getElementById('fechaNacimientoInput').value = data.fecha_nacimiento || '';
    document.getElementById('edadInput').value = data.edad || '';
    document.getElementById('sexoInput').value = data.sexo || '';
    document.getElementById('domicilioInput').value = data.domicilio || '';
    document.getElementById('telefonoInput').value = data.telefono || '';
    document.getElementById('ocupacionInput').value = data.ocupacion || '';
    document.getElementById('estadoCivilInput').value = data.estado_civil || '';
    document.getElementById('escolaridadInput').value = data.escolaridad || '';
    // --- FIN USAR IDs ---
    document.getElementById('contacto-emergencia-nombre').value = data.contacto_emergencia_nombre || '';
    document.getElementById('contacto-emergencia-numero').value = data.contacto_emergencia_numero || '';

    // Antecedentes Familiares (Marcar radios)
    setRadioValue('diabetes-parent', data.diabetes_fam);
    setRadioValue('hipertension-parent', data.hipertension_fam);
    // --- USAR IDs ---
    document.getElementById('cancerFamDetalleInput').value = data.cancer_fam_detalle || '';
    setRadioValue('e-corazon-parent', data.cardiacas_fam);
    document.getElementById('neurologicasFamDetalleInput').value = data.neurologicas_fam_detalle || '';
    document.getElementById('otrasHereditariasFamInput').value = data.otras_hereditarias_fam || '';
    // --- FIN USAR IDs ---

    // Antecedentes Personales Patológicos
    setRadioValue('diabetes-personal', data.diabetes_pers);
    setRadioValue('hipertension-personal', data.hipertension_pers);
    setRadioValue('corazon-personal', data.cardiacas_pers);
    setRadioValue('fiebre-personal', data.fiebre_reumatica_pers);
    setRadioValue('tiroides-personal', data.tiroides_pers);
    setRadioValue('asma-personal', data.asma_pers);
    setRadioValue('p-renales-personal', data.renales_pers);
    setRadioValue('gastritis-personal', data.gastritis_pers);

    // ... (llenar más campos si los añadiste) ...
}

    // --- Helper para marcar botones de radio ---
    // name: nombre del grupo de radios (ej: 'diabetes-parent')
    // value: el valor guardado (1 para 'Si', 0 para 'No')
    function setRadioValue(name, value) {
        const radios = document.querySelectorAll(`#edit-profile-modal input[type="radio"][name="${name}"]`);
        radios.forEach(radio => {
            // Asumimos que el radio 'Si' tiene value="basic" y 'No' tiene value="premium" según tu HTML
            if ((value === 1 && radio.value === 'basic') || (value === 0 && radio.value === 'premium')) {
                radio.checked = true;
            } else {
                radio.checked = false; // Desmarcar el otro
            }
        });
    }
     // --- Helper para obtener el valor de botones de radio ---
     // Devuelve 1 para 'Si' (asumiendo value='basic'), 0 para 'No' (asumiendo value='premium'), null si no se seleccionó
    function getRadioValue(name) {
        const radioChecked = document.querySelector(`#edit-profile-modal input[type="radio"][name="${name}"]:checked`);
        if (!radioChecked) return null;
        return radioChecked.value === 'basic' ? 1 : 0;
    }


    // --- Event Listener para el botón Guardar ---
    if (btnGuardarPerfil) {
    btnGuardarPerfil.addEventListener('click', async (event) => {
        // ... (preventDefault, console.log, check token) ...

        // Recolectar datos del formulario
        const profileData = {
            // Ficha identificación --- USAR IDs ---
             nombre: document.getElementById('nombreInput').value.trim() || null,
             fecha_nacimiento: document.getElementById('fechaNacimientoInput').value || null,
             edad: parseInt(document.getElementById('edadInput').value) || null,
             sexo: document.getElementById('sexoInput').value.trim() || null,
             domicilio: document.getElementById('domicilioInput').value.trim() || null,
             telefono: document.getElementById('telefonoInput').value.trim() || null,
             ocupacion: document.getElementById('ocupacionInput').value.trim() || null,
             estado_civil: document.getElementById('estadoCivilInput').value.trim() || null,
             escolaridad: document.getElementById('escolaridadInput').value.trim() || null,
             contacto_emergencia_nombre: document.getElementById('contacto-emergencia-nombre').value.trim() || null,
             contacto_emergencia_numero: document.getElementById('contacto-emergencia-numero').value.trim() || null,

            // Antecedentes Familiares --- USAR IDs ---
             diabetes_fam: getRadioValue('diabetes-parent'),
             hipertension_fam: getRadioValue('hipertension-parent'),
             cancer_fam_detalle: document.getElementById('cancerFamDetalleInput').value.trim() || null,
             cardiacas_fam: getRadioValue('e-corazon-parent'),
             neurologicas_fam_detalle: document.getElementById('neurologicasFamDetalleInput').value.trim() || null,
             otras_hereditarias_fam: document.getElementById('otrasHereditariasFamInput').value.trim() || null,

            // Antecedentes Personales (getRadioValue ya usa name, está bien)
             diabetes_pers: getRadioValue('diabetes-personal'),
             hipertension_pers: getRadioValue('hipertension-personal'),
             cardiacas_pers: getRadioValue('corazon-personal'),
             fiebre_reumatica_pers: getRadioValue('fiebre-personal'),
             tiroides_pers: getRadioValue('tiroides-personal'),
             asma_pers: getRadioValue('asma-personal'),
             renales_pers: getRadioValue('p-renales-personal'),
             gastritis_pers: getRadioValue('gastritis-personal'),
             // --- FIN USAR IDs ---

             // ... (recolectar más campos si los añadiste) ...
        };

            console.log('Datos a enviar:', profileData); // <-- DEBUG: Verifica los datos recolectados

            // Enviar datos al backend
            try {
                const response = await fetch('http://localhost:3003/api/profile', { // <-- Cambiar URL
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(profileData)
                });

                const result = await response.json();
                console.log('Respuesta del servidor:', result); // <-- DEBUG: Verifica la respuesta

                if (!response.ok) {
                    throw new Error(result.error || 'Error al guardar el perfil');
                }

                showAlert('Perfil guardado exitosamente.', 'success');
                modal.classList.remove('visible'); // Cerrar modal
                cargarPerfil(); // Recargar datos en la vista principal

            } catch (error) {
                console.error('Error guardando perfil:', error);
                showAlert(`Error al guardar: ${error.message}`, 'error');
            }
        });
    } else {
        console.error('Error: No se encontró el botón con id="btn-guardar-perfil"');
    }

     // --- Event Listener para el botón Cancelar del modal ---
     if (btnCancelar) {
         btnCancelar.addEventListener('click', () => {
             modal.classList.remove('visible');
             // Opcional: Recargar los datos originales si se cancela la edición
             // cargarPerfil(); // Descomenta si quieres que se restauren los datos al cancelar
         });
     }


    // --- Carga inicial del perfil ---
    cargarPerfil();

}); // <-- FIN DEL DOMContentLoaded