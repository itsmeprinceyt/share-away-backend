import { RequestHandler } from 'express';
import pool from '../databaseConnections/pool';

/**
 * @breif A part of /profile where we can see any user profile through their uuid.
 * @description The requested uuid is searched in the database and returns
 * all the data they need. The password is not returned for security reasons.
*/

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

        const [countRows]: any = await pool.execute(
            'SELECT COUNT(*) AS totalPosts FROM posts WHERE user_id = ?',
            [uuid]
        );
        const totalPosts = countRows[0].totalPosts || 0;
        
        const [countHearts]: any = await pool.query(
            'SELECT SUM(heart_count) AS totalHearts FROM posts WHERE uuid = ?',
            [uuid]
        );
        const totalHearts = countHearts[0].totalHearts || 0;

        const [posts]: any = await pool.execute(
            'SELECT * FROM posts WHERE user_id = ? ORDER BY posted_at DESC',
            [uuid]
        );

        res.status(200).json({
            ...user,
            totalPosts,
            totalHearts,
            posts,
        });
    } catch (error) {
        console.error('Error fetching user by UUID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
