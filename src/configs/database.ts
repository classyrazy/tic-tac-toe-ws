
import { Client, QueryResult, QueryResultRow } from 'pg';
export const client = new Client({
    user: 'postgres', 
    host: 'localhost', 
    database: 'scraper_db',
    password: 'postgres',
    port: 5432,
});

export async function connectToDatabase(): Promise<void> {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL');
    } catch (error) {
        console.error('Failed to connect to PostgreSQL:', error);
    }
}

export const createItem = async (table: string, data: any): Promise<QueryResult> => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;
    return await client.query(query, values);
}

export async function query<T extends QueryResultRow>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    try {
        const result = await client.query<T>(sql, params);
        return result;
    } catch (error: any) {
        console.error('Query failed:', error.message);
        throw error;
    }
}
