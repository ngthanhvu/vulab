import { env } from './env';

export const domains: readonly string[] = env.mailDomains
  .split(',')
  .map((d) => d.trim())
  .filter(Boolean);
