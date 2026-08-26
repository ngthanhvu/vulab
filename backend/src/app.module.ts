import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './emails/email.module';
import { NotepadModule } from './notepad/notepad.module';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';
import { CleanupService } from './cleanup/cleanup.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    EmailModule,
    NotepadModule,
    HealthModule,
    AdminModule,
  ],
  providers: [CleanupService],
})
export class AppModule {}
