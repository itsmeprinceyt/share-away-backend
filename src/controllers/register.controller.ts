import { RequestHandler } from 'express';
import pool from '../databaseConnections/pool';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import getTimeIST from '../utils/getTimeIST';
import { logger } from '../utils/logger';
import { LOCKDOWN } from '../lockdown';

/** 
 *   @brief  -  Controller for user registration.
 *   @description -  This controller handles user registration and logging the new
 *   registery in the activity_logs.
*/
export const registerUser: RequestHandler = async (req, res) => {
    if (LOCKDOWN) {
        res.status(404).json({ message: 'Lockdown is activated. New registration is currently disabled.' });
        return;
    }
    const { username, email, password, pfp } = req.body;
    logger("SIGN-UP", "User Signed up", { username, email });

    const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
    const emailDomain = email.split('@')[1];

    const bannedWords = ['fuck', 'sex', 'porn', 'ass', 'dick', 'boob', 'pussy', 'bitch'];
    const lowercaseUsername = username.toLowerCase();

    if (username.length > 15) {
        res.status(400).json({ message: 'Username must be less than 15 characters.' });
        return;
    }

    if (bannedWords.some(word => lowercaseUsername.includes(word))) {
        res.status(400).json({ message: 'Username contains inappropriate content.' });
        return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores.' });
        return;
    }

    if (!allowedDomains.includes(emailDomain)) {
        res.status(400).json({ message: 'Only Gmail, Hotmail, Yahoo, Outlook, and iCloud emails are allowed.' });
        return
    }

    const passwordRequirements = [
        { regex: /[A-Z]/, message: 'Password must contain at least 1 uppercase letter.' },
        { regex: /\d/, message: 'Password must contain at least 1 number.' },
        { regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, message: 'Password must contain at least 1 special character.' },
        { regex: /^.{5,16}$/, message: 'Password must be between 5–16 characters long.' }
    ];

    const errors: string[] = [];

    passwordRequirements.forEach((requirement) => {
        if (!requirement.regex.test(password)) {
            errors.push(requirement.message);
        }
    });

    if (errors.length > 0) {
        res.status(400).json({
            message: errors.join(' '),
        });
        return;
    }
    
    const uuid = crypto.randomUUID().slice(0, 16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const istTime = getTimeIST();

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
            res.status(400).json({ message: 'You are blacklisted' });
            return;
        }

        const [existingUsername] = await connection.query('SELECT 1 FROM users WHERE username = ?', [username]);
        if ((existingUsername as any[]).length > 0) {
            res.status(400).json({ message: 'Username already taken' });
            return;
        }

        // Insert user into the database
        await connection.query(
            'INSERT INTO users (uuid, username, email, password, pfp, registeredDate, isVerified) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuid, username, email, hashedPassword, pfp || '', istTime, 1]
        );

        // Insert action into activity_logs
        await connection.query(
            'INSERT INTO activity_logs (uuid, action, created_at) VALUES (?, ?, ?)',
            [uuid, 'registered', istTime]
        );

        await connection.commit();
        res.status(201).json({ message: "You're in our good books now!" });
    } catch (err) {
        await connection.rollback();
        console.error('❌ Registration error:', err);
        res.status(500).json({ message: 'Sign up failed', error: err });
    } finally {
        connection.release();
    }
};