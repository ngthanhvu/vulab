import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ImapService } from '../services/imapService';
import { CacheService } from '../services/cacheService';

@Module({
  controllers: [EmailController],
  providers: [EmailService, ImapService, CacheService],
  exports: [EmailService, ImapService, CacheService],
})
export class EmailModule {}
