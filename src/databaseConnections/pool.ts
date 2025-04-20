import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @brief Intiates the connection to the database.
 */

let dbConfig;

switch (process.env.ENV) {
    case 'prod':
        dbConfig = {
            host: process.env.PROD_DB_HOST,
            port: Number(process.env.PROD_DB_PORT),
            user: process.env.PROD_DB_USER,
            password: process.env.PROD_DB_PASSWORD,
            database: process.env.PROD_DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 5,
        };
        break;

    case 'dev':
    default:
        dbConfig = {
            host: process.env.DEV_DB_HOST,
            port: Number(process.env.DEV_DB_PORT),
            user: process.env.DEV_DB_USER,
            password: process.env.DEV_DB_PASSWORD,
            database: process.env.DEV_DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 5,
        };
        break;
}

const pool = mysql.createPool(dbConfig);
export default pool;