export const createUsersTable = async (connection: any) => {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(16) NOT NULL UNIQUE,
        pfp TEXT,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isVerified BOOLEAN DEFAULT false,
        isAdmin BOOLEAN DEFAULT false,
        registeredDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');
};