import pool from '../databaseConnections/pool' // your MySQL connection
import { RowDataPacket } from 'mysql2/promise';

interface User extends RowDataPacket {
    id: number;
    email: string;
    password: string;
    isVerified: boolean;
    verificationCode: string;
    verificationCodeExpiry: Date;
}

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const [rows] = await pool.query<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0];
};
