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

/**
 * @brief       - Controller to edit the post
 */
export const editPost: RequestHandler = async (req, res) => {
    const { uuid, username, user_id, post_uuid, content } = req.body;
    const istTime = moment.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if (!uuid || !username || !user_id || !post_uuid || !content) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Check if post exists and belongs to the user
        const [rows] = await connection.query(
            `SELECT user_id FROM posts WHERE post_uuid = ?`,
            [post_uuid]
        );

        if ((rows as any[]).length === 0) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        const post = (rows as any[])[0];
        const isOwner = post.user_id === user_id;

        if (!isOwner) {
            res.status(403).json({ message: 'You are not the owner of this post' });
            return;
        }

        await connection.query(
            `UPDATE posts SET content = ?, posted_at = ? WHERE post_uuid = ?`,
            [JSON.stringify(content), istTime, post_uuid]
        );

        await connection.commit();
        res.status(200).json({ message: '✅ Post updated successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('❌ Error editing post:', err);
        res.status(500).json({ message: 'Failed to edit post', error: err });
    } finally {
        connection.release();
    }
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

/**
 * @brief       - Controller to delete the post by post_uuid
 * @description - This controller retrieves the post using post_uuid and compares the
 * post's owner with the request owner uuid and deletes the post if they are same.
 */
export const deletePost: RequestHandler = async (req, res) => {
    const { uuid } = req.body;
    const { post_uuid } = req.params;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if (!uuid || !post_uuid) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const [rows] = await connection.query(
            `SELECT uuid FROM posts WHERE post_uuid = ?`,
            [post_uuid]
        );

        if ((rows as any[]).length === 0) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        const post = (rows as any[])[0];
        const isOwnerOrAdmin = post.uuid === uuid || req.body.isAdmin === 1;

        if (!isOwnerOrAdmin) {
            res.status(403).json({ message: 'You are not allowed to delete this post' });
            return;
        }

        await connection.query(
            `DELETE FROM posts WHERE post_uuid = ?`,
            [post_uuid]
        );

        await connection.commit();
        res.status(200).json({ message: '🗑️ Post deleted successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('❌ Error deleting post:', err);
        res.status(500).json({ message: 'Failed to delete post', error: err });
    } finally {
        connection.release();
    }
};

/**
 * @brief       - Controller to handle when someone clicks on heart.
 */
export const toggleHeart: RequestHandler = async (req, res) => {
    const { uuid } = req.body;
    const { post_uuid } = req.params;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if (!uuid || !post_uuid) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        // Check if post exists
        const [posts] = await connection.query(
            `SELECT heart_count FROM posts WHERE post_uuid = ?`,
            [post_uuid]
        );

        if ((posts as any[]).length === 0) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        const [logs] = await connection.query(
            `SELECT * FROM activity_logs WHERE uuid = ? AND post_uuid = ? AND action = 'heart_given'`,
            [uuid, post_uuid]
        );

        // Running this if block if heart already given
        if ((logs as any[]).length > 0) {
            await connection.query(
                `DELETE FROM activity_logs WHERE uuid = ? AND post_uuid = ? AND action = 'heart_given'`,
                [uuid, post_uuid]
            );
            await connection.query(
                `UPDATE posts SET heart_count = heart_count - 1 WHERE post_uuid = ? AND heart_count > 0`,
                [post_uuid]
            );

            await connection.commit();
            res.status(200).json({ message: '💔 Heart removed', status: 'removed' });
            return
        }

        // Continuing if no heart was given to that post by that uuid
        await connection.query(
            `INSERT INTO activity_logs (uuid, action, post_uuid) VALUES (?, ?, ?)`,
            [uuid, 'heart_given', post_uuid]
        );
        await connection.query(
            `UPDATE posts SET heart_count = heart_count + 1 WHERE post_uuid = ?`,
            [post_uuid]
        );

        await connection.commit();
        res.status(200).json({ message: '❤️ Heart added', status: 'added' });
        return;
    } catch (err) {
        await connection.rollback();
        console.error('❌ Error toggling heart:', err);
        res.status(500).json({ message: 'Failed to toggle heart', error: err });
    } finally {
        connection.release();
    }
};
