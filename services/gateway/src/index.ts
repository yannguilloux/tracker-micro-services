import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schemas/typedefs.js';
import { resolvers } from './resolvers/index.resolver.js';
import { PrismaDatasource } from './datasources/prisma/prisma.datasource.js';
import { EventDatasource } from './datasources/events/event.datasource.js';
import { ContextValueSpec } from './types/tracker.js';
import { redis, cache } from './clients/redis.client.js';
import { createPrismaClient } from './clients/prisma.client.js';

const prisma = createPrismaClient(redis);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,
});

const PORT = parseInt(process.env.PORT || '3000', 10);
const SERVICE_NAME = process.env.SERVICE_NAME || 'gateway';

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async ({ req, res }): Promise<ContextValueSpec> => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
    const { cache } = server;
    return {
      dataSources: {
        db: new PrismaDatasource(prisma),
        event: new EventDatasource({ cache }),
      },
    };
  },
});

console.log(`🚀  Server of service ${SERVICE_NAME} listening on ${url}`);
