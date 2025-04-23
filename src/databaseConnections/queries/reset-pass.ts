import bcrypt from 'bcrypt';

/**
 * @brief Resets a user's password to '12345' if the username exists.
 * @param username - The username of the account to update.
 */
export const resetPasswordToDefault = async (connection: any, username: string) => {
    const password = '12345';
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(`
        UPDATE users
        SET password = ?
        WHERE username = ?;
    `, [hashedPassword, username]);

    console.log(`🔒 Password for '${username}' has been reset to '12345'.`);
};
