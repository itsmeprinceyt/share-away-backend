/**
 * @brief Creates the blacklisted_users table if it doesn't exist.
 */
export const createBlacklistedUsersTable = async (connection: any) => {
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS blacklisted_users (
        ban_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        banned_at TIMESTAMP NOT NULL
        )
    `);
    console.log('✅ "Blacklisted Users" table ready ...');
};
