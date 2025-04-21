import { RequestHandler } from 'express';
import pool from '../databaseConnections/pool';
import moment from 'moment-timezone';

/**
 * @breif A part of /profile where we can see any user profile through their uuid.
 * @description The requested uuid is searched in the database and returns
 * all the data they need. The password is not returned for security reasons.
*/
export const getUserByUUID: RequestHandler = async (req, res) => {
    const { uuid } = req.params;
    const { viewer_uuid } = req.query;

    try {
        const [rows]: any = await pool.execute('SELECT * FROM users WHERE uuid = ?', [uuid]);

        if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = rows[0];
        delete user.password;

        const [countRows]: any = await pool.execute(
            'SELECT COUNT(*) AS totalPosts FROM posts WHERE uuid = ?',
            [uuid]
        );
        const totalPosts = countRows[0].totalPosts || 0;

        const [countHearts]: any = await pool.query(
            'SELECT SUM(heart_count) AS totalHearts FROM posts WHERE uuid = ?',
            [uuid]
        );
        const totalHearts = countHearts[0].totalHearts || 0;

        const [posts]: any = await pool.query(
            `
            SELECT 
                p.*, 
                CASE 
                    WHEN h.user_uuid IS NOT NULL THEN TRUE 
                    ELSE FALSE 
                END AS hasHearted
            FROM posts p
            LEFT JOIN hearts h 
            ON p.post_uuid = h.post_uuid AND h.user_uuid = ?
            WHERE p.uuid = ?
            ORDER BY p.posted_at DESC
            `,
            [viewer_uuid, uuid]);

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

/**
 * * @breif A part of /profile where we can validate if the user still exists or not.
 */
export const checkUserByUUID: RequestHandler = async (req, res) => {
    const { uuid } = req.params;
    try {
        const [user] = await pool.query('SELECT uuid FROM users WHERE uuid = ?', [uuid]);

        if (!Array.isArray(user) || user.length === 0) {
            res.status(404).json({ message: 'Account does not exist' });
            return;
        }

        res.status(200).json({ exists: true });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};


/**
 *  @description        - Deletes a user by UUID: archives them, adjusts hearts,
 * deletes their posts, and removes the user.
 */
export const deleteUserByUUID: RequestHandler = async (req, res) => {
    const { uuid } = req.params;
    const istTime = moment.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [userRows]: any = await connection.execute(
            'SELECT username, email FROM users WHERE uuid = ?',
            [uuid]
        );

        if (userRows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        await connection.execute(
            "INSERT INTO activity_logs (uuid, action, created_at) VALUES (?, ?, ?)",
            [uuid, 'account_deleted', istTime]
        );

        const { username, email } = userRows[0];
        await connection.execute(
            'INSERT INTO deleted_users (username, email, deleted_at) VALUES (?, ?, ?)',
            [username, email, istTime]
        );

        const [heartLogs]: any = await connection.execute(
            "SELECT post_uuid FROM activity_logs WHERE uuid = ? AND action = 'heart_given'",
            [uuid]
        );

        for (const log of heartLogs) {
            if (log.post_uuid) {
                await connection.execute(
                    'UPDATE posts SET heart_count = heart_count - 1 WHERE post_uuid = ? AND heart_count > 0',
                    [log.post_uuid]
                );
            }
        }

        await connection.execute('DELETE FROM posts WHERE uuid = ?', [uuid]);
        await connection.execute('DELETE FROM users WHERE uuid = ?', [uuid]);

        await connection.commit();
        res.status(200).json({ message: 'User account and related data deleted successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error('Error deleting user by UUID:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};

/**
 *  @description        - Bans a user: adds to blacklist, logs the action, deletes their account and content.
 */
export const banUser: RequestHandler = async (req, res) => {
    const { uuid } = req.params;
    const istTime = moment.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [userRows]: any = await connection.execute(
            'SELECT username, email FROM users WHERE uuid = ?',
            [uuid]
        );

        if (userRows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const { username, email } = userRows[0];

        await connection.execute(
            'INSERT INTO blacklisted_users (email, banned_at) VALUES (?, ?)',
            [email, istTime]
        );

        await connection.execute(
            'INSERT INTO activity_logs (uuid, action, created_at) VALUES (?, ?, ?)',
            [uuid, 'user_banned', istTime]
        );

        await connection.execute(
            "INSERT INTO activity_logs (uuid, action, created_at) VALUES (?, ?, ?)",
            [uuid, 'account_deleted', istTime]
        );

        await connection.execute(
            'INSERT INTO deleted_users (username, email, deleted_at) VALUES (?, ?, ?)',
            [username, email, istTime]
        );

        const [heartLogs]: any = await connection.execute(
            "SELECT post_uuid FROM hearts WHERE user_uuid = ?",
            [uuid]
        );

        for (const log of heartLogs) {
            if (log.post_uuid) {
                await connection.execute(
                    'UPDATE posts SET heart_count = heart_count - 1 WHERE post_uuid = ? AND heart_count > 0',
                    [log.post_uuid]
                );
            }
        }

        await connection.execute('DELETE FROM posts WHERE uuid = ?', [uuid]);
        await connection.execute('DELETE FROM users WHERE uuid = ?', [uuid]);

        await connection.commit();
        res.status(200).json({ message: 'User banned and data deleted successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error('Error banning user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};

/**
 * @description - Unbans a user by removing them from blacklist and logging the action.
 */
export const revokeBan: RequestHandler = async (req, res) => {
    const { email } = req.params;
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [userRows]: any = await connection.execute(
            'SELECT email FROM blacklisted_users WHERE email = ?',
            [email]
        );

        if (userRows.length === 0) {
            res.status(404).json({ error: 'User is not blacklisted' });
            return;
        }

        // Remove from blacklist
        await connection.execute(
            'DELETE FROM blacklisted_users WHERE email = ?',
            [email]
        );

        await connection.commit();
        res.status(200).json({ message: 'User unbanned successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error('Error unbanning user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};

/**
 * @description - Bans a user by their email address.
 */
export const banUserEmail: RequestHandler = async (req, res) => {
    const { email } = req.params;

    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return
    }

    const istTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [userRows]: any = await connection.execute(
            'SELECT uuid, username, email FROM users WHERE email = ?',
            [email]
        );

        if (userRows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const { uuid, username } = userRows[0];

        await connection.execute(
            'INSERT INTO blacklisted_users (email, banned_at) VALUES (?, ?)',
            [email, istTime]
        );

        await connection.execute(
            'INSERT INTO activity_logs (uuid, action, created_at) VALUES (?, ?, ?)',
            [uuid, 'user_banned', istTime]
        );

        await connection.execute(
            "INSERT INTO activity_logs (uuid, action, created_at) VALUES (?, ?, ?)",
            [uuid, 'account_deleted', istTime]
        );

        await connection.execute(
            'INSERT INTO deleted_users (username, email, deleted_at) VALUES (?, ?, ?)',
            [username, email, istTime]
        );

        const [heartLogs]: any = await connection.execute(
            "SELECT post_uuid FROM hearts WHERE user_uuid = ?",
            [uuid]
        );

        for (const log of heartLogs) {
            if (log.post_uuid) {
                await connection.execute(
                    'UPDATE posts SET heart_count = heart_count - 1 WHERE post_uuid = ? AND heart_count > 0',
                    [log.post_uuid]
                );
            }
        }

        await connection.execute('DELETE FROM posts WHERE uuid = ?', [uuid]);
        await connection.execute('DELETE FROM users WHERE uuid = ?', [uuid]);

        await connection.commit();
        res.status(200).json({ message: 'User banned and data deleted successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error('Error banning user:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};