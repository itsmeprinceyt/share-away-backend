import pool from './pool';
/* TABLES QUERIES */
import { createUsersTable } from './tables/users';
import { createPostsTable } from './tables/posts';
import { createHeartsTable } from './tables/hearts_table';
import { createActivityLogsTable } from './tables/activity_logs';
import { createDeletedUsersTable } from './tables/deleted_users';
import { createBlacklistedUsersTable } from './tables/blacklisted_users';

/* ACTION QUERIES */
//import { updateUser } from './queries/makeAdmin';
//import { insertAction } from './queries/insertActions';


/**
 * @breif Initialize the database by creating necessary tables if not made.
*/
export const initDatabase = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('✅ MySQL connected via pool');

        await createUsersTable(connection);
        await createPostsTable(connection);
        await createHeartsTable(connection);
        await createActivityLogsTable(connection);
        await createDeletedUsersTable(connection);
        await createBlacklistedUsersTable(connection);
        
        //await insertAction(connection);
        //await updateUser(connection,"itsmeprinceyt","add");
    } finally {
        connection.release();
    }
};