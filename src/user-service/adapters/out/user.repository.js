// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/adapters/out/user.repository.js
const { pool } = require('../../infrastructure/database.js');

const findUserById = async (userId) => {
    const [rows] = await pool.query('SELECT id, nombre, email FROM users WHERE id = ?', [userId]);
    return rows[0] || null;
};

const updateUserName = async (userId, nombre) => {
    const [result] = await pool.query('UPDATE users SET nombre = ? WHERE id = ?', [nombre, userId]);
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

// --- NUEVAS FUNCIONES PARA PERFIL ---

/**
 * Busca el perfil de un usuario por su user_id.
 * Devuelve el perfil o null si no existe.
 */
const findProfileByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    return rows[0] || null; // Devuelve el primer resultado o null
};

/**
 * Crea o actualiza el perfil de un usuario.
 * Si el perfil existe, lo actualiza. Si no, lo crea.
 * @param {number} userId - El ID del usuario.
 * @param {object} profileData - Un objeto con los datos del perfil a guardar.
 */
const upsertProfile = async (userId, profileData) => {
    // Extraemos los campos conocidos del profileData (¡asegúrate que coincidan con tu HTML!)
    // Usamos '?? null' para asegurarnos de que si un campo no viene, se inserte NULL en la BD
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
        // Antecedentes Familiares (convierte a 0 o 1 si es necesario, o déjalos como vienen si ya son 0/1)
        diabetes_fam = null,
        hipertension_fam = null,
        cancer_fam_detalle = null,
        cardiacas_fam = null,
        neurologicas_fam_detalle = null,
        otras_hereditarias_fam = null,
        // Antecedentes Personales
        diabetes_pers = null,
        hipertension_pers = null,
        cardiacas_pers = null,
        fiebre_reumatica_pers = null,
        tiroides_pers = null,
        asma_pers = null,
        renales_pers = null,
        gastritis_pers = null
        // Añade aquí más campos si los tienes en tu formulario y tabla
    } = profileData;

    // Sentencia SQL para INSERT ... ON DUPLICATE KEY UPDATE (UPSERT)
    const sql = `
        INSERT INTO user_profiles (
            user_id, fecha_nacimiento, edad, sexo, domicilio, telefono, ocupacion,
            estado_civil, escolaridad, contacto_emergencia_nombre, contacto_emergencia_numero,
            diabetes_fam, hipertension_fam, cancer_fam_detalle, cardiacas_fam,
            neurologicas_fam_detalle, otras_hereditarias_fam, diabetes_pers, hipertension_pers,
            cardiacas_pers, fiebre_reumatica_pers, tiroides_pers, asma_pers, renales_pers, gastritis_pers
            -- Añade aquí los nombres de las columnas nuevas
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
            -- Añade aquí las actualizaciones para las columnas nuevas
    `;

    // Array de valores en el orden correcto
    const values = [
        userId, fecha_nacimiento, edad, sexo, domicilio, telefono, ocupacion, estado_civil,
        escolaridad, contacto_emergencia_nombre, contacto_emergencia_numero,
        diabetes_fam, hipertension_fam, cancer_fam_detalle, cardiacas_fam, neurologicas_fam_detalle,
        otras_hereditarias_fam, diabetes_pers, hipertension_pers, cardiacas_pers,
        fiebre_reumatica_pers, tiroides_pers, asma_pers, renales_pers, gastritis_pers
        // Añade aquí los valores para las columnas nuevas
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
    updateUserName      
};