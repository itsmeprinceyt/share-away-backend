import { RequestHandler } from 'express';
import { getUserByEmail } from '../services/user.service';
import bcrypt from 'bcrypt';
/**
 * @breif Controller for user login with email.
 * @description This controller checks if the user exists using email and password
 * in the database and compares the hash values and then returns user data if its correct.
*/
export const loginUser: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

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

        // If the password is valid, return all user details (except for password)
        const { password: _, ...userDetails } = user;
        res.status(200).json(userDetails);

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
