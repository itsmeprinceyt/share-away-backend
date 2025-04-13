/**
 * @breif Update activity logs using data of users_table.
 * @description This query fetches all the user's data and then use that
 * to log entries in the activity_logs. I created this because I forgot to 
 * add activity_logs queries so 2 users were un-logged.
*/

export const insertAction = async (connection: any) => {
  // If you want to clear the existing activity logs before inserting new ones, uncomment the following line:
  
  //await connection.execute(`DELETE FROM activity_logs`);
  //console.log('🗑️ Cleared all existing activity logs');

  const [users]: any[] = await connection.execute(`
    SELECT uuid, username FROM users ORDER BY id ASC
  `);

  for (const user of users) {
    await connection.execute(`
        INSERT INTO activity_logs (uuid, action, created_at)
        VALUES (?, 'registered', NOW());
      `, [user.uuid]);

    console.log(`📝 Registered action logged for user '${user.username}'`);
  }
}


