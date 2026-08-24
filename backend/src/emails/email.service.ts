import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  getEmails,
  getEmailsByRecipient,
  getEmailByUid,
  saveEmails,
} from '../models/emailStore';
import { ImapService } from '../services/imapService';
import { CacheService } from '../services/cacheService';
import { domains } from '../config/domains';
import { redis } from '../config/database';
import type { Email } from '../types/email';

interface InboxEntry {
  created: Date;
  domain: string;
}

@Injectable()
export class EmailService {
  private readonly inboxes = new Map<string, InboxEntry>();

  constructor(
    private readonly imapService: ImapService,
    private readonly cacheService: CacheService,
  ) {}

  async generateEmail(domainQuery?: string) {
    const domain = typeof domainQuery === 'string' ? domainQuery : domains[0];
    if (!domains.includes(domain)) {
      throw new BadRequestException('Domain not available');
    }

    const local = this.generateRandomString();
    const address = `${local}@${domain}`.toLowerCase();
    this.inboxes.set(address, { created: new Date(), domain });

    await redis.setEx(
      `inbox:${address}`,
      60 * 60 * 24,
      JSON.stringify({ createdAt: new Date().toISOString(), domain }),
    );

    return { address, domain, createdAt: new Date() };
  }

  async getAllEmails(): Promise<Email[]> {
    return getEmails();
  }

  async getInbox(address: string) {
    const emails = await getEmailsByRecipient(address.toLowerCase());
    return { address, emails, count: emails.length };
  }

  async getEmail(uid: number) {
    const email = await getEmailByUid(uid);
    if (!email) {
      throw new NotFoundException('Email not found');
    }
    return email;
  }

  async refreshEmails() {
    await this.imapService.fetchEmails();
    return { success: true };
  }

  getDomains() {
    return domains;
  }

  async saveEmails(emails: Email[]) {
    await saveEmails(emails);
  }

  private generateRandomString(length = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
