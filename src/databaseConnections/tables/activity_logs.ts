export const createActivityLogsTable = async (connection: any) => {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        action ENUM('registered', 'verified', 'heart_given') NOT NULL,
        post_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Activity Logs table ready');
  };