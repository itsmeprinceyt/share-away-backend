import { RequestHandler } from 'express';
import pool from '../databaseConnections/pool';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import moment from 'moment-timezone';

/** 
 *   @brief  -  Controller for user registration.
 *   @description -  This controller handles user registration and logging the new
 *   registery in the activity_logs.
*/
export const registerUser: RequestHandler = async (req, res) => {
    const { username, email, password, pfp } = req.body;
    const uuid = crypto.randomUUID().slice(0, 16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const istTime = moment.tz("Europe/Paris").tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if ((existing as any[]).length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const [blacklisted] = await connection.query(
            'SELECT * FROM blacklisted_users WHERE email = ?',
            [email]
        );
        
        if ((blacklisted as any[]).length > 0) {
            res.status(400).json({ message: 'User is blacklisted' });
            return;
        }
        
        const [existingUsername] = await connection.query('SELECT 1 FROM users WHERE username = ?', [username]);
        if ((existingUsername as any[]).length > 0) {
            res.status(400).json({ message: 'Username already taken' });
            return;
        }

        // Insert user into the database
        await connection.query(
            'INSERT INTO users (uuid, username, email, password, pfp, registeredDate) VALUES (?, ?, ?, ?, ?, ?)',
            [uuid, username, email, hashedPassword, pfp || '', istTime]
        );

        // Insert action into activity_logs
        await connection.query(
            'INSERT INTO activity_logs (uuid, action, created_at) VALUES (?, ?, ?)',
            [uuid, 'registered', istTime]
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