import {
  ContextValueSpec,
  PaginationFilterOptionsSpec,
} from '../types/tracker';

export const Query = {
  async getWebsite(
    _: object,
    { id }: { id: string },
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.website.findUnique({ where: { id } });
  },

  async getWebsites(
    _: object,
    { offset, limit }: PaginationFilterOptionsSpec,
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.website.findMany({
      skip: offset,
      take: limit,
      orderBy: [{ name: 'asc' }],
    });
  },

  async getVisitor(
    _: object,
    { id }: { id: string },
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.visitor.findUnique({ where: { id } });
  },

  async getVisitors(
    _: object,
    { offset, limit }: PaginationFilterOptionsSpec,
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.visitor.findMany({
      skip: offset,
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
    });
  },
};
