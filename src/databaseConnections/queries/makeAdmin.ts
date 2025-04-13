/**
 * @brief Updates admin status of a user using their username.
 * @description This query sets or unsets admin privileges based on the action provided.
 */

export const updateUser = async (connection: any, username: string, action: 'add' | 'remove') => {
  const isAdmin = action === 'add';

  await connection.execute(`
      UPDATE users
      SET isAdmin = ?
      WHERE username = ?;
  `, [isAdmin, username]);

  const status = isAdmin ? 'now' : 'no longer';
  console.log(`✅ User '${username}' is ${status} an admin`);
};
