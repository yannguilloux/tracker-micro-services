import { PrismaClient, Link, Website, Visitor } from '@prisma/client';
import DataLoader from 'dataloader';
import { createPrismaClient } from '../../clients/prisma.client';

export class PrismaDatasource {
  prisma: ReturnType<typeof createPrismaClient>;
  linksByWebsiteLoader: DataLoader<number, Link[]>;
  websiteLoader: DataLoader<number, Website[]>;
  visitorLoader: DataLoader<number, Visitor[]>;

  constructor(prisma: ReturnType<typeof createPrismaClient>) {
    this.prisma = prisma;
    
    this.websiteLoader = new DataLoader(async (ids) => {
      const rows = await this.prisma.website.findMany({
        where: { id: { in: [...ids] } },
      });
      return ids.map((id) => rows.filter((row: Website) => row.id === id));
    });

    this.visitorLoader = new DataLoader(async (ids) => {
      const rows = await this.prisma.visitor.findMany({
        where: { id: { in: [...ids] } },
      });
      return ids.map((id) => rows.filter((row: Visitor) => row.id === id));
    });

    this.linksByWebsiteLoader = new DataLoader(async (websiteIds) => {
      const rows = await this.prisma.link.findMany({
        where: { website: { id: { in: [...websiteIds] } } },
      });
      return websiteIds.map((websiteId) =>
        rows.filter((link: Link) => link.websiteId === websiteId),
      );
    });
  }
}
