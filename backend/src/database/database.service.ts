import { Injectable } from '@nestjs/common';
import { db } from '../config/database';

@Injectable()
export class DatabaseService {
  async initDatabase(): Promise<void> {
    const maxAttempts = 15;
    const connection = await this.waitForConnection(maxAttempts);

    try {
      console.log('MySQL connection ready');
    } finally {
      connection.release();
    }
  }

  async checkDatabase(): Promise<boolean> {
    try {
      await db.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  private async waitForConnection(maxAttempts: number) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await db.getConnection();
      } catch (err) {
        console.warn(
          `MySQL chưa sẵn sàng, thử lại lần ${attempt}/${maxAttempts}...`,
        );
        if (attempt === maxAttempts) {
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    throw new Error('Không thể kết nối MySQL');
  }
}
