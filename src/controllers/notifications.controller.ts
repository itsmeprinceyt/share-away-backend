import { RequestHandler } from 'express';
import pool from '../databaseConnections/pool';

/**
 * @brief       - Get notification if someone likes your post.
 */
export const getHeartNotifications: RequestHandler = async (req, res) => {
    const { uuid, offset = 0, limit = 5 } = req.query;

    try {
        const [rows]: any = await pool.query(
            `
            SELECT 
                u.username AS liker_username,
                p.post_uuid
            FROM hearts h
            JOIN posts p ON h.post_uuid = p.post_uuid
            JOIN users u ON h.user_uuid = u.uuid
            WHERE p.uuid = ? AND h.user_uuid != ?
            ORDER BY h.created_at DESC
            LIMIT ? OFFSET ?
            `,
            [uuid, uuid, Number(limit), Number(offset)]
        );

        res.json({ notifications: rows });
    } catch (error) {
        console.error('Error fetching heart notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
