import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { CacheService } from '../services/cacheService';
import { db } from '../config/database';

@Controller('api/health')
export class HealthController {
  constructor(private readonly cacheService: CacheService) {}

  @Get()
  async check() {
    let dbOk = false;
    try {
      await db.query('SELECT 1');
      dbOk = true;
    } catch {
      dbOk = false;
    }

    const cache = await this.cacheService.check();
    const status = dbOk && cache ? 200 : 503;
    const body = {
      status: dbOk && cache ? 'ok' : 'degraded',
      db: dbOk,
      cache,
      timestamp: new Date().toISOString(),
    };

    if (status === 503) {
      throw new ServiceUnavailableException(body);
    }

    return body;
  }
}
