import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @brief Intiates the connection to the database.
 */

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 300,
    queueLimit: 0,
});

export default pool;