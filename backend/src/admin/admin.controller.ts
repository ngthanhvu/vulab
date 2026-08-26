import { Controller, Get } from '@nestjs/common';
import * as os from 'os';
import { RowDataPacket } from 'mysql2/promise';
import { db } from '../config/database';

interface CountRow extends RowDataPacket {
  count: number;
}

@Controller('api/admin')
export class AdminController {
  @Get('system')
  getSystemInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const cpus = os.cpus();

    return {
      uptime: {
        seconds: process.uptime(),
        formatted: this.formatUptime(process.uptime()),
      },
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
        percentage: Math.round((usedMemory / totalMemory) * 100),
        formatted: {
          total: this.formatBytes(totalMemory),
          used: this.formatBytes(usedMemory),
          free: this.formatBytes(freeMemory),
        },
      },
      cpu: {
        model: cpus[0]?.model ?? 'Unknown',
        cores: cpus.length,
        loadAverage: os.loadavg(),
      },
      platform: {
        type: os.type(),
        release: os.release(),
        arch: os.arch(),
        hostname: os.hostname(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
  }

  @Get('stats')
  async getStats() {
    const [usersRow] = await db.execute<CountRow[]>(
      'SELECT COUNT(*) as count FROM users',
    );
    const [notesRow] = await db.execute<CountRow[]>(
      'SELECT COUNT(*) as count FROM notes',
    );
    const [emailsRow] = await db.execute<CountRow[]>(
      'SELECT COUNT(*) as count FROM emails',
    );

    return {
      users: Number(usersRow[0].count),
      notes: Number(notesRow[0].count),
      emails: Number(emailsRow[0].count),
    };
  }
}
