import app from './app';
import { initDatabase } from './databaseConnections/init';

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const startServer = async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Backend running at [Hold Ctrl & click]: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Server failed to start:', err);
    }
};

startServer();
