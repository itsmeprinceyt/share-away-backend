/**
 * @brief Verifies only unverified users in the database.
 * @description This query updates isVerified to 1 only for users where it's currently 0.
 */
export const verifyUnverifiedUsers = async (connection: any) => {
    const [result]: any = await connection.execute(`
      UPDATE users
      SET isVerified = 1
      WHERE isVerified = 0;
    `);

    console.log(`✅ Verified ${result.affectedRows} users who were previously unverified.`);
};