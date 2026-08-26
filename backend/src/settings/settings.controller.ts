import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

interface SettingsBody {
  [key: string]: string;
}

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAll() {
    return this.settingsService.findAll();
  }

  @Put()
  async update(@Body() body: SettingsBody) {
    return this.settingsService.update(body);
  }
}
