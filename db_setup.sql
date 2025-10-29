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

-- 4. Crear la tabla 'user_profiles' para almacenar detalles adicionales del usuario
CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE, -- Clave foránea única para asegurar una relación 1 a 1

    -- Ficha de Identificación
    fecha_nacimiento DATE NULL,
    edad INT NULL,
    sexo VARCHAR(50) NULL,
    domicilio TEXT NULL,
    telefono VARCHAR(20) NULL,
    ocupacion VARCHAR(100) NULL,
    estado_civil VARCHAR(50) NULL,
    escolaridad VARCHAR(100) NULL,
    contacto_emergencia_nombre VARCHAR(255) NULL,
    contacto_emergencia_numero VARCHAR(20) NULL,

    -- Antecedentes Familiares (usamos TINYINT(1) como booleano: 0=No, 1=Sí)
    diabetes_fam TINYINT(1) NULL,
    hipertension_fam TINYINT(1) NULL,
    cancer_fam_detalle TEXT NULL, -- Para especificar tipo y parentesco
    cardiacas_fam TINYINT(1) NULL,
    neurologicas_fam_detalle TEXT NULL, -- Para especificar tipo
    otras_hereditarias_fam TEXT NULL,

    -- Antecedentes Personales Patológicos
    diabetes_pers TINYINT(1) NULL,
    hipertension_pers TINYINT(1) NULL,
    cardiacas_pers TINYINT(1) NULL,
    fiebre_reumatica_pers TINYINT(1) NULL,
    tiroides_pers TINYINT(1) NULL,
    asma_pers TINYINT(1) NULL,
    renales_pers TINYINT(1) NULL, -- Podríamos añadir detalle si es diálisis
    gastritis_pers TINYINT(1) NULL,
    -- Puedes añadir más campos aquí si es necesario
    -- alergias TEXT NULL,
    -- cirugias TEXT NULL,
    -- medicamentos_actuales TEXT NULL,

    -- Información de actualización
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Clave foránea
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Si se borra el usuario, se borra su perfil
);

-- (Opcional) Modificar la tabla 'users' para añadir un campo que indique si tiene perfil
-- ALTER TABLE users ADD COLUMN has_profile BOOLEAN DEFAULT FALSE;
-- Esto podría ser útil para saber si ya se creó un perfil para el usuario.
-- (Opcional) Aquí puedes agregar las tablas de productos, inventario, etc.,
-- cuando las vayas implementando en el servicio principal.


SELECT 'Bases de datos alphahealth_users y taller4 creadas exitosamente.' AS 'Estado';