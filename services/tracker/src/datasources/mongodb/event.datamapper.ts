import { db } from './mongo.client.js';
import { Event } from '../../schemas/event.schema.js';

export const eventDatamapper = {
  async save(inputData: Event) {
    return await db.collection('events').insertOne(inputData);
  },

  async findBySids(sids: number[], limit: number) {
    const promises = sids.map((sid) =>
      db
        .collection('events')
        .find({ sid })
        .sort({ _id: -1 })
        .limit(limit)
        .toArray(),
    );
    return Promise.all(promises);
  },

  async findByLinks(links: number[], limit: number) {
    const promises = links.map((link) =>
      db
        .collection('events')
        .find({ link })
        .sort({ _id: -1 })
        .limit(limit ?? 0)
        .toArray(),
    );
    return Promise.all(promises);
  },
};
