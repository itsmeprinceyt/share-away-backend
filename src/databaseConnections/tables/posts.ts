/**
 * @brief Creates the posts table if it doesn't exists.
 */
export const createPostsTable = async (connection: any) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_uuid VARCHAR(16) NOT NULL UNIQUE,
      uuid VARCHAR(16) NOT NULL,
      username VARCHAR(32) NOT NULL,
      heart_count INT DEFAULT 0,
      user_id INT NOT NULL,
      posted_at TIMESTAMP NOT NULL,
      content JSON,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ "Posts" table ready ...');
};