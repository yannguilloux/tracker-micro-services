import 'dotenv/config';
import { MongoClient } from 'mongodb';
import debug from 'debug';

const debugLog = debug('index:mongodb');

const client = new MongoClient(process.env.MONGO_URL!);

await client.connect();
const db = client.db(process.env.MONGO_DB);

const collection = db.collection('events');

await collection.createIndex({ link: 1 });
debugLog('Link index created');

await collection.createIndex({ sid: 1 });
debugLog('Website index created');

client.close();
