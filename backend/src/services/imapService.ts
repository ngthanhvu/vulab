import { Injectable } from '@nestjs/common';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import type { ParsedMail } from 'mailparser'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { setEmails } from '../models/emailStore';
import { imapConfig } from '../config/imap';
import type { Email } from '../types/email';

interface FetchedMessage {
  uid: number;
  source: Buffer;
  flags?: Set<string>;
}

@Injectable()
export class ImapService {
  private imapClient: ImapFlow | null = null;

  async connectIMAP(): Promise<void> {
    if (!imapConfig.auth.user || !imapConfig.auth.pass) {
      console.warn(
        'IMAP credentials not configured. Set IMAP_USER and IMAP_PASS env vars.',
      );
      return;
    }

    this.imapClient = new ImapFlow(imapConfig);

    this.imapClient.on('exists', () => {
      console.log('New email arrived');
      void this.fetchEmails();
    });

    this.imapClient.on('error', (err: Error) => {
      console.error('IMAP error:', err.message);
    });

    try {
      await this.imapClient.connect();
      await this.fetchEmails();
      console.log(`IMAP connected to ${imapConfig.host}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('IMAP connection failed:', error.message);
      this.imapClient = null;
    }
  }

  async fetchEmails(): Promise<void> {
    if (!this.imapClient) return;

    try {
      const mailbox = await this.imapClient.mailboxOpen('INBOX');
      if (mailbox.exists === 0) return;

      const limit = Math.min(mailbox.exists, 20);
      const startSeq = mailbox.exists - limit + 1;
      const messages = this.imapClient.fetch(
        { seq: `${startSeq}:*` },
        { source: true, uid: true, flags: true },
      );

      const newEmails: Email[] = [];
      for await (const msg of messages as AsyncIterable<FetchedMessage>) {
        try {
          const parsed = await simpleParser(msg.source);
          const fromText = this.getAddressText(parsed.from);
          const toText = this.getAddressText(parsed.to);

          newEmails.push({
            uid: msg.uid,
            subject: parsed.subject ?? '(no subject)',
            from: fromText ?? 'Unknown',
            to: toText ?? '',
            date: parsed.date ?? new Date(),
            text: String(parsed.text ?? ''),
            html: String(parsed.html ?? ''),
            seen: msg.flags?.has('\\Seen') ?? false,
          });
        } catch {
          newEmails.push({
            uid: msg.uid,
            subject: '(parse error)',
            from: 'Unknown',
            to: '',
            date: new Date(),
            text: '',
            html: '',
            seen: msg.flags?.has('\\Seen') ?? false,
          });
        }
      }
      await setEmails(newEmails.reverse());
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Error fetching emails:', error.message);
    }
  }

  private getAddressText(value: unknown): string | undefined {
    if (!value) return undefined;
    if (Array.isArray(value)) {
      const first = value[0] as { text?: string } | undefined;
      return first?.text;
    }
    return (value as { text?: string }).text;
  }
}
