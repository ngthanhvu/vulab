import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { CacheService } from '../services/cacheService';

@Module({
  controllers: [HealthController],
  providers: [CacheService],
})
export class HealthModule {}
