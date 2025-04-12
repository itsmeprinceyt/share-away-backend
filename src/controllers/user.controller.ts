import { RequestHandler } from 'express';
import pool from '../databaseConnections/pool';

export const getUserByUUID: RequestHandler = async (req, res) => {
    const { uuid } = req.params;

    try {
        const [rows]: any = await pool.execute('SELECT * FROM users WHERE uuid = ?', [uuid]);

        if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = rows[0];
        delete user.password;
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by UUID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
