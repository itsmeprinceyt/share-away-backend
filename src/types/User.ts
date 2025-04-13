import { RowDataPacket } from 'mysql2/promise';

// User Type without password
export interface User extends RowDataPacket {
    id: number;
    uuid: string;
    pfp: string | null;
    username: string;
    email: string;
    isVerified: boolean;
    isAdmin: boolean;
    registeredDate: Date;
}
