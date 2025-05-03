import pool from '../databaseConnections/pool'
import { User } from '../types/User';

/**
 * @brief To fetch user data from the database using their email.
 * @description A user service helper function for login.controller.ts to help
 * login using email.
*/

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const [rows] = await pool.query<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0];
};

export const getUserByUsername = async (username: string): Promise<User | undefined> => {
    const [rows] = await pool.query<User[]>(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    return rows[0];
};