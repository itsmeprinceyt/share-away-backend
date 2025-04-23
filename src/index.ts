import app from './app';
import { initDatabase } from './databaseConnections/init';
import dotenv from 'dotenv';
import getSystemInfo from './utils/getSystemData';

dotenv.config();
const systemInfo = getSystemInfo();
const ENV = process.env.ENV;
const PORT =
    ENV === 'prod'
        ? process.env.PROD_PORT
        : process.env.DEV_PORT;

const startServer = async () => {
    try {
        console.log('------------------------');
        await initDatabase();
        app.listen(PORT, () => {
            console.log('------------------------');
            console.log('System Information:');
            console.log('------------------------');
            console.log(`- Time (IST): ${systemInfo.currentTimeIST}`);
            console.log(`- Uptime: ${systemInfo.uptime}`);
            console.log(`- Platform: ${systemInfo.platform}`);
            console.log(`- Architecture: ${systemInfo.arch}`);
            console.log(`- Hostname: ${systemInfo.hostname}`);
            console.log('------------------------');
            console.log(`🚀 Backend running at [Hold Ctrl & click]: http://localhost:${PORT}`);
            console.log('------------------------');
        });
    } catch (err) {
        console.error('❌ Server failed to start:', err);
    }
};

startServer();
