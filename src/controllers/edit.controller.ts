import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import pool from '../databaseConnections/pool';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';

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
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [user] = await connection.query('SELECT * FROM users WHERE uuid = ?', [uuid]);
        if ((user as any[]).length === 0) {
            res.status(404).json({ message: 'User not found' });
            return
        }
        const userData = (user as any[])[0];

        const SECRET_KEY = process.env.JWT_TOKEN;
        const token = req.headers['authorization']?.split(' ')[1];
        const decoded: any = jwt.verify(token!, SECRET_KEY!);

        if (decoded.isAdmin !== 1) {
            // Compare the current password with the stored hashed password only if its the owner, if its the admin then ignore this
            const isMatch = await bcrypt.compare(currentPassword, userData.password);
            if (!isMatch) {
                res.status(400).json({ message: 'Current password is incorrect' });
                return
            }
        }

        // When the current password is correct, then regex check the new password
        const passwordRequirements = [
            { regex: /[A-Z]/, message: 'Password must contain at least 1 uppercase letter.' },
            { regex: /\d/, message: 'Password must contain at least 1 number.' },
            { regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, message: 'Password must contain at least 1 special character.' },
            { regex: /^.{5,16}$/, message: 'Password must be between 5–16 characters long.' }
        ];

        const errors: string[] = [];

        passwordRequirements.forEach((requirement) => {
            if (!requirement.regex.test(confirmPassword)) {
                errors.push(requirement.message);
            }
        });

        if (errors.length > 0) {
            res.status(400).json({
                message: errors.join(' '),
            });
            return;
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
