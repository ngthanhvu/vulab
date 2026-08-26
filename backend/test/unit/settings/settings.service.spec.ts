import { SettingsService } from '../../../src/settings/settings.service';
import * as settingStore from '../../../src/models/settingStore';

jest.mock('../../../src/models/settingStore');

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    service = new SettingsService();
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return all settings', async () => {
      jest.spyOn(settingStore, 'getAllSettings').mockResolvedValueOnce({
        appName: 'Admin Dashboard',
        language: 'vi',
      });

      const result = await service.findAll();

      expect(result).toEqual({ appName: 'Admin Dashboard', language: 'vi' });
    });
  });

  describe('update', () => {
    it('should update settings and return updated values', async () => {
      jest.spyOn(settingStore, 'setSettings').mockResolvedValueOnce({
        appName: 'My App',
        language: 'en',
      });

      const result = await service.update({ appName: 'My App', language: 'en' });

      expect(result).toEqual({ appName: 'My App', language: 'en' });
    });
  });
});
