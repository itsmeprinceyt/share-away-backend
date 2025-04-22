import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import pool from '../databaseConnections/pool';
import { logger } from '../utils/logger';

/**
 * @brief                   - Controller to update the user's password.
 * @description             - This controller checks the user's current password, compares it with the stored password,
 *                            hashes the new password, and updates it in the database.
 * 
 * @param currentPassword - Current Password.
 * @param confirmPassword - New Password.
 */
export const editPassword: RequestHandler = async (req, res) => {
    const { uuid, currentPassword, confirmPassword } = req.body;
    logger("ACTION", "Edit password", { uuid });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,15}$/;
    if (!passwordRegex.test(confirmPassword)) {
        res.status(400).json({
            message: 'Password must be 8–15 characters long, include 1 uppercase letter, 1 number, and 1 special character.',
        });
        return;
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [user] = await connection.query('SELECT * FROM users WHERE uuid = ?', [uuid]);
        if ((user as any[]).length === 0) {
            res.status(404).json({ message: 'User not found' });
            return
        }
        const userData = (user as any[])[0];

        // Compare the current password with the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, userData.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Current password is incorrect' });
            return
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(confirmPassword, 10);
        await connection.query('UPDATE users SET password = ? WHERE uuid = ?', [hashedPassword, uuid]);

        await connection.commit();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('❌ Password update error:', err);
        res.status(500).json({ message: 'Failed to update password', error: err });
    } finally {
        connection.release();
    }
};

/**
 * @brief       - Controller to update the user's profile picture (PFP).
 * @description - This controller updates the user's profile picture in the database.
 */
export const editPfp: RequestHandler = async (req, res) => {
    const { uuid, pfp } = req.body;
    logger("ACTION", "Edit profile picture", { uuid });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Retrieve user from the database by UUID
        const [user] = await connection.query('SELECT * FROM users WHERE uuid = ?', [uuid]);
        if ((user as any[]).length === 0) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // Update the profile picture in the database
        await connection.query('UPDATE users SET pfp = ? WHERE uuid = ?', [pfp, uuid]);

        await connection.commit();
        res.status(200).json({ message: 'Profile picture updated successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('❌ Profile picture update error:', err);
        res.status(500).json({ message: 'Failed to update profile picture', error: err });
    } finally {
        connection.release();
    }
};
