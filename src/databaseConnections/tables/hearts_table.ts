/**
* @brief Creates the hearts table.
*/
export const createHeartsTable = async (connection: any) => {
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS hearts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_uuid VARCHAR(36) NOT NULL,
        post_uuid VARCHAR(36) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        UNIQUE KEY unique_heart (user_uuid, post_uuid),
        FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE,
        FOREIGN KEY (post_uuid) REFERENCES posts(post_uuid) ON DELETE CASCADE
    )
    `);
    console.log('✅ "Hearts Table" table ready ...');
};