/**
 * @brief Unbans a user by removing their email from the blacklisted_users table.
 * @description Deletes the email from blacklist to restore access.
 */
export const unbanUser = async (connection: any, email: string) => {
    await connection.execute(`
      DELETE FROM blacklisted_users
      WHERE email = ?;
    `, [email]);

    console.log(`✅ User with email '${email}' has been removed from blacklist.`);
};
