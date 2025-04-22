import { RequestHandler } from 'express';
import pool from '../databaseConnections/pool';
import { logger } from '../utils/logger';

/**
 * @brief       - Controller to add heart to the post.
 */
export const addHeart: RequestHandler = async (req, res) => {
    const { uuid, post_uuid } = req.body;
    logger("ACTION", "Added heart", { uuid, post_uuid });

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if (!uuid || !post_uuid) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        await connection.query(
            `INSERT INTO hearts (user_uuid, post_uuid) VALUES (?, ?)`,
            [uuid, post_uuid]
        );

        await connection.query(
            `INSERT INTO activity_logs (uuid, action, post_uuid, created_at) 
             VALUES (?, 'heart_given', ?, NOW())`,
            [uuid, post_uuid]
        );

        await connection.query(
            `UPDATE posts 
             SET heart_count = heart_count + 1, 
                 posted_at = posted_at
             WHERE post_uuid = ?`,
            [post_uuid]
        );

        await connection.commit();
        res.status(201).json({ message: '❤️ Heart added successfully' });
    } catch (error: any) {
        await connection.rollback();

        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'You already hearted this post' });
        } else {
            console.error('❌ Error adding heart:', error);
            res.status(500).json({ message: 'Failed to add heart', error });
        }
    } finally {
        connection.release();
    }
};

/**
 * @brief       - Controller to remove the heart from the post.
 */
export const removeHeart: RequestHandler = async (req, res) => {
    const { uuid, post_uuid } = req.query;
    logger("ACTION", "Removed heart", { uuid, post_uuid });
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if (!uuid || !post_uuid) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const [result] = await connection.query(
            `DELETE FROM hearts WHERE user_uuid = ? AND post_uuid = ?`,
            [uuid, post_uuid]
        );

        if ((result as any).affectedRows === 0) {
            await connection.rollback();
            res.status(404).json({ message: 'Heart not found' });
            return;
        }

        await connection.query(
            `UPDATE posts 
             SET heart_count = GREATEST(heart_count - 1, 0), 
                 posted_at = posted_at
             WHERE post_uuid = ?`,
            [post_uuid]
        );

        await connection.query(
            `DELETE FROM activity_logs WHERE uuid = ? AND post_uuid = ? AND action = 'heart_given'`,
            [uuid, post_uuid]
        );

        await connection.commit();
        res.status(200).json({ message: '💔 Heart removed successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('❌ Error removing heart:', error);
        res.status(500).json({ message: 'Failed to remove heart', error });
    } finally {
        connection.release();
    }
};
