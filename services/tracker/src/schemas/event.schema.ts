import { z } from 'zod';

export const eventSchema = z.object({
  t: z.enum(['c', 'v', 'p']),
  surl: z.string().url(),
  ua: z.string(),
  ip: z.string().ip(),
  sid: z.number().min(1),
  link: z.number().min(1).optional(),
});
export type Event = z.infer<typeof eventSchema>;
