// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/adapters/out/citas.repository.js
const { pool } = require('../../infrastructure/database.js');

/**
 * Crea una nueva cita en la base de datos
 */
const create = async (userId, fecha, hora, tratamiento) => {
    const [result] = await pool.query(
        'INSERT INTO citas (user_id, fecha, hora, tratamiento) VALUES (?, ?, ?, ?)',
        [userId, fecha, hora, tratamiento]
    );
    return { id: result.insertId };
};

/**
 * Busca todas las citas de un usuario específico
 */
const findByUserId = async (userId) => {
    const [rows] = await pool.query(
        // Formateamos la fecha a YYYY-MM-DD para que sea compatible con JS
        'SELECT id, DATE_FORMAT(fecha, "%Y-%m-%d") as fecha, hora, tratamiento, estado FROM citas WHERE user_id = ? ORDER BY fecha, hora',
        [userId]
    );
    return rows;
};

/**
 * Busca TODAS las citas y las une con el nombre del paciente
 * de la base de datos 'alphahealth_users'.
 */
const findAllWithPatientName = async () => {
    // Usamos un JOIN explícito entre las dos bases de datos
    // ASUMIMOS que el usuario de BD 'root' tiene permisos sobre 'taller4' y 'alphahealth_users'
    const query = `
        SELECT 
            c.id, 
            c.user_id, 
            u.nombre AS nombre_paciente, 
            DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, 
            c.hora, 
            c.tratamiento, 
            c.estado 
        FROM 
            citas c
        JOIN 
            alphahealth_users.users u ON c.user_id = u.id
        ORDER BY 
            c.fecha, c.hora
    `;
    const [rows] = await pool.query(query);
    return rows;
};
// --- FIN DE LA NUEVA FUNCIÓN ---

// --- AÑADE ESTAS DOS NUEVAS FUNCIONES ---

/**
 * Busca una cita específica SOLO si pertenece al usuario.
 */
const findCitaByIdAndUser = async (citaId, userId) => {
    const [rows] = await pool.query(
        'SELECT * FROM citas WHERE id = ? AND user_id = ?',
        [citaId, userId]
    );
    return rows[0];
};

/**
 * Actualiza una cita por su ID.
 * Esta función es dinámica y puede actualizar los campos permitidos.
 */
const updateCitaById = async (citaId, data) => {
    // Campos permitidos para actualizar
    const allowedFields = ['fecha', 'hora', 'tratamiento', 'estado'];
    
    const fieldsToUpdate = Object.keys(data)
        .filter(field => allowedFields.includes(field));

    if (fieldsToUpdate.length === 0) {
        throw new Error('No hay campos válidos para actualizar.');
    }

    // Construir la parte SET de la consulta
    const setClause = fieldsToUpdate
        .map(field => `${field} = ?`)
        .join(', ');
    
    const values = fieldsToUpdate.map(field => data[field]);

    const query = `UPDATE citas SET ${setClause} WHERE id = ?`;
    
    const [result] = await pool.query(query, [...values, citaId]);
    return result;
};

module.exports = {
    create,
    findByUserId,
    findAllWithPatientName,
    findCitaByIdAndUser, 
    updateCitaById
};