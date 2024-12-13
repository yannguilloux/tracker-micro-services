import { PrismaClient } from '@prisma/client';
import type { Redis } from 'ioredis';

export const createPrismaClient = (redis: Redis) => {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  return prisma.$extends({
    name: 'prismaWithCache',
    query: {
      async $allOperations({ operation, model, args, query }) {
        // Skip cache for mutations
        if (operation === 'create' || 
            operation === 'update' || 
            operation === 'delete' || 
            operation === 'upsert') {
          return query(args);
        }

        const cacheKey = `prisma:${model}:${operation}:${JSON.stringify(args)}`;

        const cached = await redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }

        const result = await query(args);
        
        if (result) {
          await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
        }

        return result;
      },
    },
  });
}; 