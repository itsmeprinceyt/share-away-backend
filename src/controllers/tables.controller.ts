import { Request, Response } from 'express';
import pool from '../databaseConnections/pool';

export const getTables = async (_req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT table_name 
             FROM information_schema.tables 
             WHERE table_schema = ?`,
            [process.env.DB_NAME]
        );

        const tableNames = (rows as { table_name: string }[]).map(row => row.table_name);
        res.json({ tables: tableNames });
        console.error('✅ Tables fetched!: ', tableNames);
    } catch (err) {
        console.error('❌ Error fetching tables:', err);
        res.status(500).json({ message: 'Failed to fetch table names' });
    } finally {
        connection.release();
    }
};

export const getTableData = async (req: Request, res: Response) => {
    const tableName = req.params.name;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(`SELECT * FROM ??`, [tableName]);
        connection.release();
        res.json({ data: rows });
        console.error('✅ Tables fetched!: ', tableName);
    } catch (err) {
        console.error('❌ Error fetching table data:', err);
        res.status(500).json({ message: 'Failed to fetch table data' });
    }
};