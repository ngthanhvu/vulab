import { Injectable, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { deleteOldEmails } from '../models/emailStore';

@Injectable()
export class CleanupService implements OnModuleInit {
  private readonly emailRetentionHours = Number(
    process.env.EMAIL_RETENTION_HOURS ?? '24',
  );

  onModuleInit() {
    console.log(
      `Cleanup scheduled every hour (retention: ${this.emailRetentionHours}h)`,
    );
  }

  @Interval(60 * 60 * 1000)
  async cleanupOldEmails() {
    try {
      const deleted = await deleteOldEmails(this.emailRetentionHours);
      if (deleted > 0) console.log(`Cleaned up ${deleted} old emails`);
    } catch (err) {
      console.error(
        'Cleanup failed:',
        err instanceof Error ? err.message : String(err),
      );
    }
  }
}
