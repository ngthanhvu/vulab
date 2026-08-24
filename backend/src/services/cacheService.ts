import { Injectable } from '@nestjs/common';
import { redis } from '../config/database';

@Injectable()
export class CacheService {
  async connect(): Promise<void> {
    await redis.connect();
    console.log('Redis connected');
  }

  async check(): Promise<boolean> {
    try {
      await redis.ping();
      return true;
    } catch {
      return false;
    }
  }
}
