import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('api/emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('domains')
  getDomains() {
    return this.emailService.getDomains();
  }

  @Get('generate')
  generateEmail(@Query('domain') domain?: string) {
    return this.emailService.generateEmail(domain);
  }

  @Get('inbox/:address')
  getInbox(@Param('address') address: string) {
    if (!address) {
      throw new BadRequestException('Address is required');
    }
    return this.emailService.getInbox(address);
  }

  @Get(':uid')
  getEmail(@Param('uid', ParseIntPipe) uid: number) {
    return this.emailService.getEmail(uid);
  }

  @Post('refresh')
  refreshEmails() {
    return this.emailService.refreshEmails();
  }

  @Get()
  getAllEmails() {
    return this.emailService.getAllEmails();
  }
}
