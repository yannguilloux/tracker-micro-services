import { resolvers as scalarResolvers } from 'graphql-scalars';
import { Query } from './query.resolver.js';
import { Mutation } from './mutation.resolver.js';
import { WebsiteResolver as Website } from './website.resolver.js';
import { LinkResolver as Link } from './link.resolver.js';
export const resolvers = {
  ...scalarResolvers,
  Query,
  Mutation,
  Website,
  Link,
};
