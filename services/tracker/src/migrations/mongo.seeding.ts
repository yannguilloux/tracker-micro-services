import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { MongoClient, ObjectId } from 'mongodb';
import debug from 'debug';

/**
 * Generate a random ObjectId with a timestamp within a given period.
 * @param startDate - Start date of the period.
 * @param endDate - End date of the period.
 * @returns An ObjectId containing a timestamp based on a random date.
 */
function generateRandomObjectId(startDate: Date, endDate: Date): ObjectId {
  // Convert dates to Unix timestamps (in seconds)
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  // Generate a random timestamp within the given period
  const randomTimestamp =
    Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) +
    startTimestamp;

  // Create a 12-byte buffer to structure the ObjectId
  const buffer = Buffer.alloc(12);

  // insert the random timestamp into the first 4 bytes
  buffer.writeUInt32BE(randomTimestamp, 0);

  // fulfills the remaining bytes randomly to simulate a complete ObjectId
  for (let i = 4; i < 12; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }

  // Create the ObjectId from the buffer
  return new ObjectId(buffer);
}

const debugLog = debug('seeding:mongodb');

const client = new MongoClient(process.env.MONGO_URL!);

await client.connect();
const db = client.db(process.env.MONGO_DB);

/* Fake events */
/*
t = type
  c = click
  v = view
  p = purchase
surl = source_url
ua = user_agent
ip = ip
link = link_id
*/

const collection = db.collection('events');
/*
await collection.drop();
debugLog("Events collection dropped")
*/

interface Event {
  _id: ObjectId;
  t: string;
  surl: string;
  ua: string;
  ip: string;
  sid: number;
  link?: number;
}

// For a large number of insertions we have 2 problems:
// 1. the maximum number of elements in memory
// 2. the insertion time in the database
// If we put too many elements in memory, we can saturate the memory and crash the program
// If we insert one element at a time, it can take forever
// We will therefore balance the two by inserting several times in batches
// We have on one side the total number of elements (EVENT_COUNT) and on the other the number of elements per batch (BATCH_SIZE)
// We will do EVENT_COUNT / BATCH_SIZE insertions in batch

const EVENT_COUNT = parseInt(process.env.EVENT_COUNT!, 10) || 10000000;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE!, 10) || 500000;

for (let i = 0; i < EVENT_COUNT / BATCH_SIZE; i++) {
  const events = Array.from({ length: BATCH_SIZE }, () => {
    const t = faker.helpers.arrayElement(['c', 'v', 'p']);
    const event: Event = {
      _id: generateRandomObjectId(new Date('2024-01-01'), new Date()),
      t,
      surl: faker.internet.url(),
      ua: faker.internet.userAgent(),
      ip: faker.internet.ipv4(),
      sid: faker.number.int({ min: 1, max: 1000 }),
    };
    if (t === 'c') {
      event.link = faker.number.int({ min: 1, max: 1000 });
    }
    return event;
  });
  await collection.insertMany(events);
}

debugLog(`events inserted`);
client.close();
