import { RequestHandler } from 'express';
import { getUserByEmail } from '../services/user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import LoginRequestBody from '../types/LoginRequestBody';
import { logger } from '../utils/logger';

/**
 * @breif Controller for user login with email.
 * @description This controller checks if the user exists using email and password
 * in the database and compares the hash values and then returns user data if its correct.
*/
export const loginUser: RequestHandler<{}, {}, LoginRequestBody> = async (req, res) => {
    const { email, password } = req.body;
    logger("LOGIN", "User logged in", { email });

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Compare the entered password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const payload = {
            id: user.id,
            uuid: user.uuid,
            pfp: user.pfp,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin,
            registeredDate: user.registeredDate
        };

        const token = jwt.sign(payload, process.env.JWT_TOKEN!, { expiresIn: '30d' });

        // If the password is valid, return all user details (except for password)
        const { password: _, ...userDetails } = user;

        res.status(200).json({
            token,
            user: userDetails
        });
        return;

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};