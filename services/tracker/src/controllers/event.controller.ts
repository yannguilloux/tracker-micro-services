import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { visitorDatamapper } from '../datasources/gateway/visitor.datamapper.js';
import { eventDatamapper } from '../datasources/mongodb/event.datamapper.js';
import { Event, eventSchema } from '../schemas/event.schema.js';
import { numberListToArray } from '../utils/number-list-to-array.js';

interface FilterEvent {
  sids?: string;
  links?: string;
  limit?: string;
}

export const eventController = {
  async insert(req: Request, res: Response, next: NextFunction) {
    const { t, link, sid } = req.query;
    let { uuid } = req.query;
    const { ip, headers } = req;
    const ua = headers['user-agent'];

    if (!uuid) {
      uuid = crypto.randomUUID();
      await visitorDatamapper.insert({ uuid });
    }

    const document = { t, link, sid, ip, ua, uuid };
    const eventData = eventSchema.parse(document);
    const eventInserted = await eventDatamapper.save(eventData as Event);

    res.status(201).json({ uuid, inserted: eventInserted.acknowledged });
  },

  async list(req: Request, res: Response) {
    const { sids, links, limit } = req.query as FilterEvent;
    const events = [];

    const linkList = numberListToArray(links);
    const sidList = numberListToArray(sids);

    if (sidList.length > 0) {
      const sEvents = await eventDatamapper.findBySids(
        sidList,
        limit ? parseInt(limit, 10) : 0,
      );
      events.push(...sEvents.flat());
    }

    if (linkList.length > 0) {
      const lEvents = await eventDatamapper.findByLinks(
        linkList,
        parseInt(limit as string, 10),
      );
      events.push(...lEvents.flat());
    }

    res
      .status(200)
      .header('Cache-Control', 'public, max-age=60, s-maxage=120')
      .json(events);
  },
};
