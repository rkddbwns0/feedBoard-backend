import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pgConfig = {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DBNAME,
};

const dbClient = new Client(pgConfig);

dbClient.connect();

export const pgQuery = <T>(query: string, values: any[]): Promise<{ rows: T[] }> => {
    return new Promise((resolve, reject) => {
        dbClient.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

export default dbClient;
