import pool from './pool';
import { createUsersTable } from './tables/users';
import { createPostsTable } from './tables/posts';
import { createActivityLogsTable } from './tables/activity_logs';
import { createDeletedUsersTable } from './tables/deleted_users';

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
        await createActivityLogsTable(connection);
        await createDeletedUsersTable(connection);
        
        //await insertAction(connection);
        //await updateUser(connection,"itsmeprinceyt");
    } finally {
        connection.release();
    }
};