/**
 * @brief Creates the activity_logs table if it doesn't exist.
 */
export const createActivityLogsTable = async (connection: any) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      log_id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(16) NOT NULL,
      action ENUM('registered', 'heart_given', 'account_deleted', 'user_banned') NOT NULL,
      post_uuid VARCHAR(16),
      created_at TIMESTAMP NOT NULL,
      FOREIGN KEY (post_uuid) REFERENCES posts(post_uuid) ON DELETE SET NULL
    )
  `);
  console.log('✅ "Activity Logs" table ready ...');
};