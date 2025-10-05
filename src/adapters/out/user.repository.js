// filepath: c:\Users\ivaan\OneDrive\Documentos\NodeJS\backend\src\adapters\out\user.repository.js
const { pool } = require('../../infrastructure/database.js');

const findByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

const createUser = async (username, password) => {
    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    return { id: result.insertId, username };
};

module.exports = {
    findByUsername,
    createUser,
};