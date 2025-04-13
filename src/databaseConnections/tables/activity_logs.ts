/**
 * @brief Creates the activity_logs table if it doesn't exist.
 */

export const createActivityLogsTable = async (connection: any) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      log_id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(16) NOT NULL,
      action ENUM('registered', 'heart_given', 'account_deleted') NOT NULL,
      post_id INT,
      created_at TIMESTAMP NOT NULL,
      FOREIGN KEY (uuid) REFERENCES users(uuid) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
    )
  `);
  console.log('✅ "Activity Logs" table ready ...');
};
