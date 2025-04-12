export const updateUser = async (connection: any, username:string) => {
    await connection.execute(`
      UPDATE users
      SET isAdmin = true
      WHERE username = '${username}';
    `);
    console.log(`✅ User '${username}' is now an admin`);
};