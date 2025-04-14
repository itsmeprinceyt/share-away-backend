import { RequestHandler } from 'express';
import pool from '../databaseConnections/pool';
import moment from 'moment-timezone';

/**
 * @brief       - Controller to create a new post.
 * @description - This controller inserts a new post into the database with user's info and post content.
 */
export const createPost: RequestHandler = async (req, res) => {
    const { uuid, username, user_id, post_uuid, content } = req.body;
    const istTime = moment.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        if (!uuid || !username || !user_id || !post_uuid || !content) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        await connection.query(
            `INSERT INTO posts (uuid, username, user_id, post_uuid, content, posted_at) VALUES (?, ?, ?, ?, ?, ?)`,
            [uuid, username, user_id, post_uuid, JSON.stringify(content), istTime]
        );

        await connection.commit();
        res.status(201).json({ message: '✅ Post created successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('❌ Error creating post:', err);
        res.status(500).json({ message: 'Failed to create post', error: err });
    } finally {
        connection.release();
    }
};

export const editPost: RequestHandler = async (req, res) => {

};

/**
 * @brief       - Controller to fetch a specific post by its post_uuid.
 * @description - This controller retrieves a post along with basic user info using the post_uuid.
 */
export const viewPost: RequestHandler = async (req, res) => {
    const { post_uuid } = req.params;
    const connection = await pool.getConnection();

    try {
        if (!post_uuid) {
            res.status(400).json({ message: 'Missing post UUID' });
            return;
        }

        const [rows] = await connection.query(
            `SELECT post_uuid, uuid, username, user_id, heart_count, content, posted_at 
             FROM posts 
             WHERE post_uuid = ?`,
            [post_uuid]
        );

        if ((rows as any[]).length === 0) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        const post = (rows as any[])[0];
        const parsedContent = JSON.parse(post.content);

        res.status(200).json({
            message: '✅ Post fetched successfully',
            post: {
                ...post,
                content: parsedContent
            }
        });
    } catch (err) {
        console.error('❌ Error fetching post:', err);
        res.status(500).json({ message: 'Failed to fetch post', error: err });
    } finally {
        connection.release();
    }
};

export const deletePost: RequestHandler = async (req, res) => {

};