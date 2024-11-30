import { PrismaClient, Link, Website, Visitor } from '@prisma/client';
import DataLoader from 'dataloader';

export class PrismaDatasource extends PrismaClient {
  linksByWebsiteLoader: DataLoader<number, Link[]>;
  websiteLoader: DataLoader<number, Website[]>;
  visitorLoader: DataLoader<number, Visitor[]>;

  constructor(config: object) {
    super(config);

    this.websiteLoader = new DataLoader(async (ids) => {
      const rows = await this.website.findMany({
        where: { id: { in: [...ids] } },
      });
      return ids.map((id) => rows.filter((row: Website) => row.id === id));
    });

    this.visitorLoader = new DataLoader(async (ids) => {
      const rows = await this.visitor.findMany({
        where: { id: { in: [...ids] } },
      });
      return ids.map((id) => rows.filter((row: Visitor) => row.id === id));
    });

    this.linksByWebsiteLoader = new DataLoader(async (websiteIds) => {
      const rows = await this.link.findMany({
        where: { website: { id: { in: [...websiteIds] } } },
      });
      return websiteIds.map((websiteId) =>
        rows.filter((link: Link) => link.websiteId === websiteId),
      );
    });
  }
}
