// puzzlezer0/alphahealth/alphahealth-9ff70f5394a43fcdb875334e0d00e4eb39f098f9/src/adapters/out/user.repository.js
const { pool } = require('../../infrastructure/database.js');

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

module.exports = {
    findByEmail,
    createUser,
};