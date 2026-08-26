import { Injectable } from '@nestjs/common';
import { getAllSettings, setSettings } from '../models/settingStore';

@Injectable()
export class SettingsService {
  async findAll(): Promise<Record<string, string>> {
    return getAllSettings();
  }

  async update(
    settings: Record<string, string>,
  ): Promise<Record<string, string>> {
    return setSettings(settings);
  }
}
