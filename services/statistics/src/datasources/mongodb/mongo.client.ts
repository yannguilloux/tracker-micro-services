import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL!);

await client.connect();
export const db = client.db(process.env.MONGO_DB);
