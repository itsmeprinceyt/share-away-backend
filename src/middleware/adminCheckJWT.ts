import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.JWT_TOKEN;

const adminCheckJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: 'Access Denied. No token provided.' });
        return;
    }

    try {
        const decoded: any = jwt.verify(token, SECRET_KEY!);

        if (decoded.isAdmin === 0) {
            res.status(403).json({ message: 'You are not authorized as an admin.' });
            return;
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' });
        return;
    }
};

export default adminCheckJWT;
