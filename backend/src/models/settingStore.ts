import { db } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface Setting {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SettingRow extends RowDataPacket {
  setting_key: string;
  setting_value: string;
  created_at: Date;
  updated_at: Date;
}

function rowToSetting(row: SettingRow): Setting {
  return {
    key: row.setting_key,
    value: row.setting_value,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const [rows] = await db.execute<SettingRow[]>(
    'SELECT setting_key, setting_value, created_at, updated_at FROM settings ORDER BY setting_key',
  );
  return rows.reduce((acc, row) => {
    acc[row.setting_key] = row.setting_value;
    return acc;
  }, {} as Record<string, string>);
}

export async function setSettings(
  settings: Record<string, string>,
): Promise<Record<string, string>> {
  const connection = await db.getConnection();
  try {
    for (const [key, value] of Object.entries(settings)) {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
        [key, value],
      );
    }
    return getAllSettings();
  } finally {
    connection.release();
  }
}
