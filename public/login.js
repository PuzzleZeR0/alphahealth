// public/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');
    const API_URL = 'http://localhost:3000'; // Asegúrate que esta URL sea correcta

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso, guardar el token
                localStorage.setItem('token', data.token);
                message.style.color = 'green';
                message.textContent = data.message;

                // Redirigir a la página de inicio
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                message.style.color = 'red';
                message.textContent = data.message;
            }
        } catch (error) {
            message.style.color = 'red';
            message.textContent = 'Error al conectar con el servidor. Inténtalo de nuevo más tarde.';
        }
    });
});