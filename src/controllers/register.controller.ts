import { RequestHandler } from 'express';
import pool from '../databaseConnections/pool';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import moment from 'moment-timezone';

/** 
 *   @brief  -  Controller for user registration and email verification.
 *   @description -  This controller handles user registration and email verification. It includes functions to register a new user, send a verification email, and verify the user's email address.
*/
export const registerUser: RequestHandler = async (req, res) => {
    const { username, email, password, pfp } = req.body;
    const uuid = crypto.randomUUID().slice(0, 16);
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if ((existing as any[]).length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Convert the current time to IST (Indian Standard Time)
        const istTime = moment.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

        // Insert user into the database
        await connection.query(
            'INSERT INTO users (uuid, username, email, password, pfp, registeredDate) VALUES (?, ?, ?, ?, ?, ?)',
            [uuid, username, email, hashedPassword, pfp || '', istTime]
        );

        const [userRow] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        const userId = (userRow as any[])[0].id;

        // Insert action into activity_logs
        await connection.query(
            'INSERT INTO activity_logs (user_id, action, created_at) VALUES (?, ?, ?)',
            [userId, 'registered', istTime]
        );

        await connection.commit();

        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        await connection.rollback();
        console.error('❌ Registration error:', err);
        res.status(500).json({ message: 'Registration failed', error: err });
    } finally {
        connection.release();
    }
};