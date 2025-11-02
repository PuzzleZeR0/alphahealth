document.addEventListener('DOMContentLoaded', async () => { // <-- Hacemos la función async
    
    // --- BLOQUE 1: TOKEN descomentar ---
    /*
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No hay token');
        // auth.js se encargará de redirigir si es necesario
        return;
    }
    */

    // --- BLOQUE 2: VERIFICACIÓN DE PERFIL descomentar ---
    /*
    let perfilCompleto = false;
    try {
        const profileResponse = await fetch('http://localhost:3003/api/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            
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
        showAlert('No se pudo verificar tu perfil. Intenta más tarde.', 'error');
        return; 
    }
    */

    // --- 3. OBTENER ELEMENTOS DEL DOM descomentar---

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

    // --- BLOQUE 4: LÓGICA CONDICIONAL descomentar ---
    /*
    if (perfilCompleto) {
        // --- A. PERFIL COMPLETO: Cargar todo normally ---
        
        console.log("Perfil completo. Cargando funcionalidad de citas.");

        // --- 1. Cargar Citas al iniciar ---
        async function cargarCitas() {
            // ... (todo el código de cargar citas) ...
        }

        // --- 2. Renderizar Citas en la tabla ---
        function renderCitas(citas) {
            // ... (todo el código de renderizar citas) ...
        }

        // --- 3. Manejar envío del formulario ---
        formCita.addEventListener('submit', async (e) => {
            // ... (todo el código de enviar formulario) ...
        });

        // --- 4. Mostrar/Ocultar formulario ---
        // ESTOS SON LOS LISTENERS QUE MOVIMOS AFUERA
        
        // --- Carga inicial ---
        cargarCitas();

    } else {
        // --- B. PERFIL INCOMPLETO: Bloquear funcionalidad ---
        
        console.warn("Perfil incompleto. Bloqueando creación de citas.");

        // ... (todo el código de perfil incompleto) ...
    }
    */

    // --- 5. LISTENERS PARA LIVE PREVIEW  ---
    if (btnCrearCita) {
        btnCrearCita.addEventListener('click', () => {
            if (formularioDiv) formularioDiv.classList.remove('hidden');
        });
    }

    if (btnCancelarCita) {
        btnCancelarCita.addEventListener('click', () => {
            if (formularioDiv) formularioDiv.classList.add('hidden');
            if (formCita) formCita.reset();
        });
    }


}); // <-- FIN DEL DOMContentLoaded