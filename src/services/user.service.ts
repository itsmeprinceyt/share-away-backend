import pool from '../databaseConnections/pool'
import { User } from '../types/User';

/**
 * @brief To fetch user data from the database using their email.
 * @description A user service helper function for login-reset.controller.ts to help
 * login using email.
*/

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const [rows] = await pool.query<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0];
};
