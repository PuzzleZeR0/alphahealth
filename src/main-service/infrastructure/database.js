// puzzlezer0/alphahealth/src/main-service/infrastructure/database.js

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,         // Credencial compartida
    password: process.env.DB_PASSWORD, // Credencial compartida
    database: process.env.DB_NAME,     // Base de datos Principal
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        await pool.getConnection();
        console.log('Successfully connected to the MySQL MAIN database.');
    } catch (error) {
        console.error('Error connecting to the MAIN database:', error.message);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    pool
};