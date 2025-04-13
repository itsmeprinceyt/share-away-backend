/**
 * @brief Creates the deleted user table if it doesn't exists.
 */

export const createDeletedUsersTable = async (connection: any) => {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS deleted_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ "Deleted Users" table ready ...');
  };