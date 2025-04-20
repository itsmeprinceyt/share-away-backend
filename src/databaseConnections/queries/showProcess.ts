/**
 * @brief Shows process.
 */

export const showProcess = async (connection: any) => {
    try {
        const [rows] = await connection.execute('SHOW PROCESSLIST;');
        console.table(rows);
        return rows;
    } catch (err) {
        console.error('Error showing process list:', err);
        throw err;
    }
};
