import { Request, Response } from 'express';
import pool from '../databaseConnections/pool';
import { logger } from '../utils/logger';

/**
 * @breif A part of /admin panel where we can see all the tables.
 * @description This controller returns all the tables in the database.
 * We can also see the data in the tables using the getTableData controller.
*/
const getDatabaseName = (): string => {
    switch (process.env.ENV) {
        case 'prod':
            return process.env.PROD_DB_NAME as string;
        case 'dev':
        default:
            return process.env.DEV_DB_NAME as string;
    }
};

export const getTables = async (_req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        const dbName = getDatabaseName();

        const [rows] = await connection.query(
            `SELECT table_name 
             FROM information_schema.tables 
             WHERE table_schema = ?`,
            [dbName]
        );

        const tableNames = (rows as { table_name: string }[]).map(row => row.table_name);
        res.json({ tables: tableNames });
        logger("ADMIN", "Fetched all tables", { tableNames});
    } catch (err) {
        console.error('❌ Error fetching tables:', err);
        res.status(500).json({ message: 'Failed to fetch table names' });
    } finally {
        connection.release();
    }
};

/**
 * @breif A part of /admin panel where we can see all data in a requested table.
*/

export const getTableData = async (req: Request, res: Response) => {
    const tableName = req.params.name;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(`SELECT * FROM ??`, [tableName]);
        connection.release();
        res.json({ data: rows });
        logger("ADMIN", "Fetched table data", { tableName});
    } catch (err) {
        console.error('❌ Error fetching table data:', err);
        res.status(500).json({ message: 'Failed to fetch table data' });
    }
};