import { Link } from '@prisma/client';
import {
  ContextValueSpec,
  PaginationFilterOptionsSpec,
} from '../types/tracker';

export const LinkResolver = {
  async events(
    link: Link,
    args: PaginationFilterOptionsSpec,
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.event.eventsByLinkLoader.load({
      id: link.id,
      limit: args.limit,
    });
  },
};
