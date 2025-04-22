export default interface DecodedUser {
    id: number;
    uuid: string;
    pfp: string | null;
    username: string;
    email: string;
    isVerified: boolean;
    isAdmin: boolean;
    registeredDate: Date;
}
