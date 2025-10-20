/*
 ====================================================================
  SCRIPT DE CONFIGURACIÓN DE BASES DE DATOS PARA ALPHAHEALTH
 ====================================================================
 
  Este script crea las dos bases de datos necesarias para
  los microservicios del proyecto.
 
  - Servicio de Usuarios (Puerto 3003) -> Base de datos: `alphahealth_users`
  - Servicio Principal (Puerto 5555)    -> Base de datos: `taller4`
 
  Asegúrate de que tus credenciales en el archivo .env 
  (DB_USER y DB_PASSWORD) tengan permisos para CREAR bases de datos.
*/

/*
-- =============================================
-- SERVICIO DE USUARIOS (AUTH)
-- Base de datos: alphahealth_users
-- =============================================
*/

-- 1. Crear la base de datos para usuarios
CREATE DATABASE IF NOT EXISTS alphahealth_users;

-- 2. Usar la base de datos
USE alphahealth_users;

-- 3. Crear la tabla 'users'
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    -- 'password' almacena el hash de bcrypt
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
-- =============================================
-- SERVICIO PRINCIPAL (MAIN)
-- Base de datos: taller4
-- =============================================
*/

-- 1. Crear la base de datos principal
CREATE DATABASE IF NOT EXISTS taller4;

-- 2. Usar la base de datos
USE taller4;

-- 3. Crear la tabla 'citas'
CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    -- Este 'user_id' es el 'id' de la tabla 'users' en la OTRA base de datos
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tratamiento VARCHAR(255) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Opcional) Aquí puedes agregar las tablas de productos, inventario, etc.,
-- cuando las vayas implementando en el servicio principal.


SELECT 'Bases de datos alphahealth_users y taller4 creadas exitosamente.' AS 'Estado';