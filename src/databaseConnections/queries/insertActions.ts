export const insertAction = async (connection: any) => {
    // Step 2: Fetch 2 existing users
    const [users]: any[] = await connection.execute(`
      SELECT id, username FROM users ORDER BY id ASC LIMIT 2
    `);

    // Step 3: Insert 'registered' action for them into activity_logs
    for (const user of users) {
        await connection.execute(`
        INSERT INTO activity_logs (user_id, action)
        VALUES (?, 'registered');
      `, [user.id]);

        console.log(`📝 Registered action logged for user '${user.username}'`);
    }
};
