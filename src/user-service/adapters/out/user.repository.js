// src/user-service/adapters/out/user.repository.js
const { pool } = require('../../infrastructure/database.js');

const findUserById = async (userId) => {
    // AÑADIR 'rol' A ESTA CONSULTA
    const [rows] = await pool.query('SELECT id, nombre, email, rol FROM users WHERE id = ?', [userId]);
    return rows[0] || null;
};

const updateUserName = async (userId, nombre) => {
    const [result] = await pool.query('UPDATE users SET nombre = ? WHERE id = ?', [nombre, userId]);
    return result;
};

// --- NUEVA FUNCIÓN PARA ACTUALIZAR EMAIL ---
const updateUserEmail = async (userId, newEmail) => {
    const [result] = await pool.query('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId]);
    return result;
};

// --- NUEVA FUNCIÓN PARA ACTUALIZAR CONTRASEÑA ---
const updateUserPassword = async (userId, newHashedPassword) => {
    const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, userId]);
    return result;
};

const findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const createUser = async (nombre, email, password) => {
    const [result] = await pool.query(
        'INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, password]
    );
    return { id: result.insertId, nombre, email };
};

// --- FUNCIONES DE PERFIL (SIN CAMBIOS) ---

const findProfileByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    return rows[0] || null; // Devuelve el primer resultado o null
};

const upsertProfile = async (userId, profileData) => {
    const {
        fecha_nacimiento = null,
        edad = null,
        sexo = null,
        domicilio = null,
        telefono = null,
        ocupacion = null,
        estado_civil = null,
        escolaridad = null,
        contacto_emergencia_nombre = null,
        contacto_emergencia_numero = null,
        diabetes_fam = null,
        hipertension_fam = null,
        cancer_fam_detalle = null,
        cardiacas_fam = null,
        neurologicas_fam_detalle = null,
        otras_hereditarias_fam = null,
        diabetes_pers = null,
        hipertension_pers = null,
        cardiacas_pers = null,
        fiebre_reumatica_pers = null,
        tiroides_pers = null,
        asma_pers = null,
        renales_pers = null,
        gastritis_pers = null
    } = profileData;

    const sql = `
        INSERT INTO user_profiles (
            user_id, fecha_nacimiento, edad, sexo, domicilio, telefono, ocupacion,
            estado_civil, escolaridad, contacto_emergencia_nombre, contacto_emergencia_numero,
            diabetes_fam, hipertension_fam, cancer_fam_detalle, cardiacas_fam,
            neurologicas_fam_detalle, otras_hereditarias_fam, diabetes_pers, hipertension_pers,
            cardiacas_pers, fiebre_reumatica_pers, tiroides_pers, asma_pers, renales_pers, gastritis_pers
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            fecha_nacimiento = VALUES(fecha_nacimiento), edad = VALUES(edad), sexo = VALUES(sexo),
            domicilio = VALUES(domicilio), telefono = VALUES(telefono), ocupacion = VALUES(ocupacion),
            estado_civil = VALUES(estado_civil), escolaridad = VALUES(escolaridad),
            contacto_emergencia_nombre = VALUES(contacto_emergencia_nombre),
            contacto_emergencia_numero = VALUES(contacto_emergencia_numero),
            diabetes_fam = VALUES(diabetes_fam), hipertension_fam = VALUES(hipertension_fam),
            cancer_fam_detalle = VALUES(cancer_fam_detalle), cardiacas_fam = VALUES(cardiacas_fam),
            neurologicas_fam_detalle = VALUES(neurologicas_fam_detalle),
            otras_hereditarias_fam = VALUES(otras_hereditarias_fam),
            diabetes_pers = VALUES(diabetes_pers), hipertension_pers = VALUES(hipertension_pers),
            cardiacas_pers = VALUES(cardiacas_pers), fiebre_reumatica_pers = VALUES(fiebre_reumatica_pers),
            tiroides_pers = VALUES(tiroides_pers), asma_pers = VALUES(asma_pers),
            renales_pers = VALUES(renales_pers), gastritis_pers = VALUES(gastritis_pers)
    `;

    const values = [
        userId, fecha_nacimiento, edad, sexo, domicilio, telefono, ocupacion, estado_civil,
        escolaridad, contacto_emergencia_nombre, contacto_emergencia_numero,
        diabetes_fam, hipertension_fam, cancer_fam_detalle, cardiacas_fam, neurologicas_fam_detalle,
        otras_hereditarias_fam, diabetes_pers, hipertension_pers, cardiacas_pers,
        fiebre_reumatica_pers, tiroides_pers, asma_pers, renales_pers, gastritis_pers
    ];

    const [result] = await pool.query(sql, values);
    return result;
};

module.exports = {
    findByEmail,
    createUser,
    findProfileByUserId, 
    upsertProfile,
    findUserById,      
    updateUserName,
    updateUserEmail,    // <-- Exportar nueva función
    updateUserPassword  // <-- Exportar nueva función
};