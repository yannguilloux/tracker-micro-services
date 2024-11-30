import { RESTDataSource } from '@apollo/datasource-rest';
import { EventSpec } from '../../types/tracker';
import DataLoader from 'dataloader';

interface LimitedLoader {
  id: number;
  limit: number;
}

export class EventDatasource extends RESTDataSource {
  override baseURL = process.env.EVENTS_API_URL;

  eventsByWebsiteLoader: DataLoader<LimitedLoader, EventSpec[]>;
  eventsByLinkLoader: DataLoader<LimitedLoader, EventSpec[]>;

  constructor(config: object) {
    super(config);

    this.eventsByWebsiteLoader = new DataLoader(async (loaders) => {
      const ids = loaders.map((loader) => loader.id).flat();
      const limit = loaders[0].limit;
      const rows = await this.findEventByWebsites(ids, limit);
      return loaders.map((loader) =>
        rows.filter((event: EventSpec) => loader.id === event.sid),
      );
    });

    this.eventsByLinkLoader = new DataLoader(async (loaders) => {
      const ids = loaders.map((loader) => loader.id).flat();
      const limit = loaders[0].limit;
      const rows = await this.findEventByLinks(ids, limit);
      return ids.map((linkId) =>
        rows.filter((event: EventSpec) => event.link === linkId),
      );
    });
  }

  async findEventByWebsites(
    websiteIds: readonly number[],
    limit: number,
  ): Promise<EventSpec[]> {
    return await this.get('api/events', {
      params: {
        sids: websiteIds.join(','),
        limit: limit.toString(),
      },
    });
  }

  async findEventByLinks(
    linkIds: readonly number[],
    limit: number,
  ): Promise<EventSpec[]> {
    return await this.get('api/events', {
      params: {
        links: linkIds.join(','),
        limit: limit.toString(),
      },
    });
  }
}
