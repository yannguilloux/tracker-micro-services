// Type pour les fonctions du cache
import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import Redis from 'ioredis';

// Configurer ioredis pour se connecter à KeyDB
export const redis = new Redis({
  host: process.env.KEYDB_HOST, // Adresse de ton instance KeyDB
  port: parseInt(process.env.KEYDB_PORT || '6379', 10), // Port de KeyDB
});

export const cache: KeyValueCache<string> = {
  get: async (key) => {
    const value = (await redis.get(key)) || undefined;
    return value;
  },
  set: async (key, value, options) => {
    const ttl = options?.ttl || 60;
    await redis.set(key, value, 'EX', ttl); // ttl en secondes
  },
  delete: async (key) => {
    await redis.del(key);
  },
};
