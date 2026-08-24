import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './emails/email.module';
import { HealthModule } from './health/health.module';
import { CleanupService } from './cleanup/cleanup.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    EmailModule,
    HealthModule,
  ],
  providers: [CleanupService],
})
export class AppModule {}
