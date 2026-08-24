import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseService } from './database/database.service';
import { CacheService } from './services/cacheService';
import { ImapService } from './services/imapService';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true });

  try {
    const databaseService = app.get(DatabaseService);
    const cacheService = app.get(CacheService);
    const imapService = app.get(ImapService);

    await databaseService.initDatabase();
    await cacheService.connect();

    imapService.connectIMAP().catch((err: Error) => {
      console.error('IMAP init failed:', err.message);
    });

    await app.listen(env.port);
    console.log(`Backend running on port ${env.port}`);
  } catch (err) {
    console.error(
      'Bootstrap failed:',
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }
}
void bootstrap();
