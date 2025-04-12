import dotenv from 'dotenv';
import app from './app';
import { initDatabase } from './databaseConnections/init';

dotenv.config();
const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Backend running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Server failed to start:', err);
    }
};

startServer();
