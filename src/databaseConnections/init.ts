import pool from './pool';
import { createUsersTable } from './tables/users';
import { createPostsTable } from './tables/posts';
import { createEmailVerificationTokensTable } from './tables/email_verification_tokens';
import { createActivityLogsTable } from './tables/activity_logs';
import { createDeletedUsersTable } from './tables/deleted_users';

export const initDatabase = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('✅ MySQL connected via pool');

        await createUsersTable(connection);
        await createPostsTable(connection);
        await createEmailVerificationTokensTable(connection);
        await createActivityLogsTable(connection);
        await createDeletedUsersTable(connection);
    } finally {
        connection.release();
    }
};