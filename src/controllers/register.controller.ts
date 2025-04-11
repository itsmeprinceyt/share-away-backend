import { Request, Response, RequestHandler } from 'express';
import pool from '../databaseConnections/pool';
import { generateCode } from '../utils/generateCode';
import { sendCustomEmail } from '../services/email.service';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const registerUser: RequestHandler = async (req, res) => {
    const { username, email, password, pfp } = req.body;
    const uuid = crypto.randomUUID().slice(0, 16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if ((existing as any[]).length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        await connection.query(
            'INSERT INTO users (uuid, username, email, password, pfp) VALUES (?, ?, ?, ?, ?)',
            [uuid, username, email, hashedPassword, pfp || '']
        );

        await connection.query(
            `INSERT INTO email_verification_tokens (email, code, expires_at) VALUES (?, ?, ?)`,
            [email, verificationCode, expiresAt]
        );

        await sendCustomEmail(email, verificationCode);
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

export const verifyUser: RequestHandler = async (req, res) => {
    const { email, code } = req.body;
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(
            'SELECT * FROM email_verification_tokens WHERE email = ? AND code = ?',
            [email, code]
        );

        const token = (rows as any[])[0];
        if (!token || new Date(token.expires_at) < new Date()) {
            res.status(400).json({ message: 'Invalid or expired verification code' });
            return;
        }

        await connection.query('UPDATE users SET isVerified = true WHERE email = ?', [email]);
        await connection.query('DELETE FROM email_verification_tokens WHERE email = ?', [email]);

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('❌ Verification error:', err);
        res.status(500).json({ message: 'Verification failed', error: err });
    } finally {
        connection.release();
    }
};
