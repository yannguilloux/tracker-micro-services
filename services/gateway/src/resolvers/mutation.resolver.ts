import { Prisma } from '@prisma/client';

import { ContextValueSpec } from '../types/tracker';

export const Mutation = {
  async createWebsite(
    _: object,
    websiteInputData: Prisma.WebsiteCreateInput,
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.website.create(websiteInputData);
  },

  async updateWebsite(
    _: object,
    {
      id,
      ...websiteInputData
    }: { id: number; websiteInputData: Prisma.WebsiteUpdateInput },
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.website.update({
      where: { id },
      data: websiteInputData,
    });
  },

  async deleteWebsite(
    _: object,
    { id }: { id: number },
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.websiteDatamapper.delete({ where: { id } });
  },

  async createLink(
    _: object,
    linkInputData: Prisma.LinkCreateInput,
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.linkDatamapper.create(linkInputData);
  },

  async updateLink(
    _: object,
    {
      id,
      ...linkInputData
    }: { id: number; linkInputData: Prisma.LinkUpdateInput },
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.linkDatamapper.update({
      where: { id },
      data: id,
      linkInputData,
    });
  },

  async deleteLink(
    _: object,
    { id }: { id: number },
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.linkDatamapper.delete({ where: { id } });
  },

  async createVisitor(
    _: object,
    { input }: { input: Prisma.VisitorCreateInput },
    { dataSources }: ContextValueSpec,
  ) {
    return await dataSources.db.prisma.visitor.create(input);
  },
};
