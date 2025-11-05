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

module.exports = {
    create,
    findByUserId,
    findAllWithPatientName
};