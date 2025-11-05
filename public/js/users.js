document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const modalPerfil = document.getElementById('edit-profile-modal');
    const modalCuenta = document.getElementById('edit-dates-profile');
    
    const btnGuardarPerfil = document.getElementById('btn-guardar-perfil');
    const btnGuardarCuenta = document.getElementById('btn-guardar-cuenta'); // <-- Nuevo botón
    
    const btnCancelarPerfil = modalPerfil.querySelector('.js-close-modal.btn-danger');
    const btnCancelarCuenta = modalCuenta.querySelector('.js-close-modal.btn-danger');

    // --- Función para cargar datos del perfil ---
    async function cargarPerfil() {
        if (!token) return; 

        try {
            const response = await fetch('http://localhost:3003/api/profile', {
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
            
            // Llenar los campos de la vista principal (fuera del modal)
            document.getElementById('UsuarioBD').textContent = profileData.nombre || 'No disponible';
            document.getElementById('EmailBD').textContent = profileData.email || 'No disponible';
            document.getElementById('contacto-emergencia-display').textContent = 
                profileData.contacto_emergencia_nombre ? `${profileData.contacto_emergencia_nombre} (${profileData.contacto_emergencia_numero || 'S/N'})` : 'No especificado';

        } catch (error) {
            console.error('Error cargando perfil:', error);
            showAlert(`Error al cargar el perfil: ${error.message}`, 'error');
        }
    }

    // --- Función para llenar el formulario con datos existentes ---
    function llenarFormulario(data) {
        // Ficha de identificación
        document.getElementById('nombreInput').value = data.nombre || '';
        document.getElementById('fechaNacimientoInput').value = data.fecha_nacimiento || '';
        document.getElementById('edadInput').value = data.edad || '';
        
        // --- CORRECCIÓN GÉNERO ---
        // Llama a setRadioValue con el *name* del radio button y el valor guardado
        setRadioValue('gender', data.sexo); 
        
        document.getElementById('domicilioInput').value = data.domicilio || '';
        document.getElementById('telefonoInput').value = data.telefono || '';
        document.getElementById('ocupacionInput').value = data.ocupacion || '';
        document.getElementById('estadoCivilInput').value = data.estado_civil || '';
        document.getElementById('escolaridadInput').value = data.escolaridad || '';
        document.getElementById('contacto-emergencia-nombre').value = data.contacto_emergencia_nombre || '';
        document.getElementById('contacto-emergencia-numero').value = data.contacto_emergencia_numero || '';

        // Antecedentes Familiares (Marcar radios)
        setRadioValue('diabetes-parent', data.diabetes_fam);
        setRadioValue('hipertension-parent', data.hipertension_fam);
        document.getElementById('cancerFamDetalleInput').value = data.cancer_fam_detalle || '';
        setRadioValue('e-corazon-parent', data.cardiacas_fam);
        document.getElementById('neurologicasFamDetalleInput').value = data.neurologicas_fam_detalle || '';
        document.getElementById('otrasHereditariasFamInput').value = data.otras_hereditarias_fam || '';

        // Antecedentes Personales Patológicos
        setRadioValue('diabetes-personal', data.diabetes_pers);
        setRadioValue('hipertension-personal', data.hipertension_pers);
        setRadioValue('corazon-personal', data.cardiacas_pers);
        setRadioValue('fiebre-personal', data.fiebre_reumatica_pers);
        setRadioValue('tiroides-personal', data.tiroides_pers);
        setRadioValue('asma-personal', data.asma_pers);
        setRadioValue('p-renales-personal', data.renales_pers);
        setRadioValue('gastritis-personal', data.gastritis_pers);
    }

    // --- Helper para marcar botones de radio (MODIFICADO) ---
    // name: nombre del grupo de radios (ej: 'gender', 'diabetes-parent')
    // value: el valor guardado (ej: 'male', 'female', 1, 0)
    function setRadioValue(name, value) {
        // Aseguramos que el valor sea un string para la comparación, si no es nulo
        const stringValue = (value !== null && value !== undefined) ? String(value) : null;
        
        const radios = document.querySelectorAll(`#edit-profile-modal input[type="radio"][name="${name}"]`);
        
        radios.forEach(radio => {
            if (radio.value === stringValue) {
                radio.checked = true;
            } else {
                radio.checked = false;
            }
        });
    }

    // --- Helper para obtener el valor de botones de radio (MODIFICADO) ---
    // Devuelve el 'value' del radio seleccionado (ej: 'male', '1', '0') o null
    function getRadioValue(name) {
        const modal = document.getElementById('edit-profile-modal'); // Buscar solo en el modal de perfil
        const radioChecked = modal.querySelector(`input[type="radio"][name="${name}"]:checked`);
        
        if (!radioChecked) return null;
        
        // Convertir "1" y "0" a números, pero dejar "male" y "female" como strings
        if (radioChecked.value === '1') return 1;
        if (radioChecked.value === '0') return 0;
        
        return radioChecked.value; // Devuelve 'male' o 'female'
    }

    // --- Event Listener para el botón Guardar PERFIL ---
    if (btnGuardarPerfil) {
        btnGuardarPerfil.addEventListener('click', async (event) => {
            event.preventDefault();
            if (!token) return;

            // Recolectar datos del formulario
            const profileData = {
                // Ficha identificación
                nombre: document.getElementById('nombreInput').value.trim() || null,
                fecha_nacimiento: document.getElementById('fechaNacimientoInput').value || null,
                edad: parseInt(document.getElementById('edadInput').value) || null,
                
                // --- CORRECCIÓN GÉNERO ---
                sexo: getRadioValue('gender'), // Llama a la función corregida

                domicilio: document.getElementById('domicilioInput').value.trim() || null,
                telefono: document.getElementById('telefonoInput').value.trim() || null,
                ocupacion: document.getElementById('ocupacionInput').value.trim() || null,
                estado_civil: document.getElementById('estadoCivilInput').value.trim() || null,
                escolaridad: document.getElementById('escolaridadInput').value.trim() || null,
                contacto_emergencia_nombre: document.getElementById('contacto-emergencia-nombre').value.trim() || null,
                contacto_emergencia_numero: document.getElementById('contacto-emergencia-numero').value.trim() || null,

                // Antecedentes Familiares
                diabetes_fam: getRadioValue('diabetes-parent'),
                hipertension_fam: getRadioValue('hipertension-parent'),
                cancer_fam_detalle: document.getElementById('cancerFamDetalleInput').value.trim() || null,
                cardiacas_fam: getRadioValue('e-corazon-parent'),
                neurologicas_fam_detalle: document.getElementById('neurologicasFamDetalleInput').value.trim() || null,
                otras_hereditarias_fam: document.getElementById('otrasHereditariasFamInput').value.trim() || null,

                // Antecedentes Personales
                diabetes_pers: getRadioValue('diabetes-personal'),
                hipertension_pers: getRadioValue('hipertension-personal'),
                cardiacas_pers: getRadioValue('corazon-personal'),
                fiebre_reumatica_pers: getRadioValue('fiebre-personal'),
                tiroides_pers: getRadioValue('tiroides-personal'),
                asma_pers: getRadioValue('asma-personal'),
                renales_pers: getRadioValue('p-renales-personal'),
                gastritis_pers: getRadioValue('gastritis-personal'),
            };

            console.log('Datos de PERFIL a enviar:', profileData);

            // Enviar datos al backend
            try {
                const response = await fetch('http://localhost:3003/api/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(profileData)
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Error al guardar el perfil');
                }

                showAlert('Perfil guardado exitosamente.', 'success');
                modalPerfil.classList.remove('visible'); // Cerrar modal de perfil
                cargarPerfil(); // Recargar datos en la vista principal

            } catch (error) {
                console.error('Error guardando perfil:', error);
                showAlert(`Error al guardar: ${error.message}`, 'error');
            }
        });
    } else {
        console.error('Error: No se encontró el botón con id="btn-guardar-perfil"');
    }

    // --- (NUEVO) Event Listener para el botón Guardar CUENTA (Email/Pass) ---
    if (btnGuardarCuenta) {
        btnGuardarCuenta.addEventListener('click', async (event) => {
            event.preventDefault();
            if (!token) return;

            const nuevoEmail = document.getElementById('nuevo-email').value.trim();
            const confirmarEmail = document.getElementById('confirmar-email').value.trim();
            const nuevoPassword = document.getElementById('nuevo-password').value.trim();
            const confirmarPassword = document.getElementById('confirmar-password').value.trim();

            let emailActualizado = false;
            let passActualizado = false;

            // --- Lógica para Email ---
            if (nuevoEmail) {
                if (nuevoEmail !== confirmarEmail) {
                    showAlert('Los correos electrónicos no coinciden.', 'warning');
                    return;
                }
                try {
                    const response = await fetch('http://localhost:3003/api/account/email', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ newEmail: nuevoEmail })
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.error);
                    emailActualizado = true;
                } catch (error) {
                    showAlert(`Error al cambiar email: ${error.message}`, 'error');
                    return; // Detener si falla el email
                }
            }

            // --- Lógica para Contraseña ---
            if (nuevoPassword) {
                if (nuevoPassword !== confirmarPassword) {
                    showAlert('Las contraseñas no coinciden.', 'warning');
                    return;
                }
                try {
                    const response = await fetch('http://localhost:3003/api/account/password', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ newPassword: nuevoPassword })
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.error);
                    passActualizado = true;
                } catch (error) {
                    showAlert(`Error al cambiar contraseña: ${error.message}`, 'error');
                    return; // Detener si falla la contraseña
                }
            }

            // --- Feedback final ---
            if (emailActualizado && passActualizado) {
                showAlert('Email y contraseña actualizados.', 'success');
            } else if (emailActualizado) {
                showAlert('Email actualizado.', 'success');
            } else if (passActualizado) {
                showAlert('Contraseña actualizada.', 'success');
            } else {
                showAlert('No se realizó ningún cambio.', 'info');
            }

            // Limpiar formulario y cerrar modal
            document.getElementById('nuevo-email').value = '';
            document.getElementById('confirmar-email').value = '';
            document.getElementById('nuevo-password').value = '';
            document.getElementById('confirmar-password').value = '';
            modalCuenta.classList.remove('visible');
            cargarPerfil(); // Recargar datos (especialmente el email en la vista)
        });
    } else {
         console.error('Error: No se encontró el botón con id="btn-guardar-cuenta"');
    }


    // --- Event Listeners para botones Cancelar ---
    if (btnCancelarPerfil) {
        btnCancelarPerfil.addEventListener('click', () => {
            modalPerfil.classList.remove('visible');
            cargarPerfil(); // Restaura los datos originales al cancelar
        });
    }
    if (btnCancelarCuenta) {
        btnCancelarCuenta.addEventListener('click', () => {
             // Limpiar campos por seguridad
            document.getElementById('nuevo-email').value = '';
            document.getElementById('confirmar-email').value = '';
            document.getElementById('nuevo-password').value = '';
            document.getElementById('confirmar-password').value = '';
            modalCuenta.classList.remove('visible');
        });
    }

    // --- Carga inicial del perfil ---
    cargarPerfil();

}); // <-- FIN DEL DOMContentLoaded