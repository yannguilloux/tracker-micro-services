import { Website } from '@prisma/client';
import {
  ContextValueSpec,
  PaginationFilterOptionsSpec,
} from '../types/tracker';

export const WebsiteResolver = {
  async links(website: Website, _: object, { dataSources }: ContextValueSpec) {
    return await dataSources.db.prisma.linksByWebsiteLoader.load(website.id);
  },

  async events(
    website: Website,
    args: PaginationFilterOptionsSpec,
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.event.eventsByWebsiteLoader.load({
      id: website.id,
      limit: args.limit,
    });
  },
};
