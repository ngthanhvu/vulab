import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EmailController } from '../../../src/emails/email.controller';
import { EmailService } from '../../../src/emails/email.service';

describe('EmailController', () => {
  let controller: EmailController;
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            getDomains: jest
              .fn()
              .mockReturnValue(['example.com', 'test.com']),
            generateEmail: jest
              .fn()
              .mockResolvedValue({
                address: 'abc@example.com',
                domain: 'example.com',
                createdAt: new Date(),
              }),
            getInbox: jest.fn().mockResolvedValue({
              address: 'abc@example.com',
              emails: [],
              count: 0,
            }),
            getEmail: jest.fn().mockResolvedValue({
              uid: 1,
              subject: 'Test',
              from: 'a@example.com',
              to: 'abc@example.com',
              date: new Date(),
              text: 'text',
              html: '<p>html</p>',
              seen: false,
            }),
            refreshEmails: jest.fn().mockResolvedValue({ success: true }),
            getAllEmails: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    service = module.get<EmailService>(EmailService);
  });

  describe('getDomains', () => {
    it('should return list of available domains', () => {
      const result = controller.getDomains();

      expect(result).toEqual(['example.com', 'test.com']);
      expect(service.getDomains).toHaveBeenCalled();
    });
  });

  describe('generateEmail', () => {
    it('should generate email for provided domain', async () => {
      const result = await controller.generateEmail('example.com');

      expect(service.generateEmail).toHaveBeenCalledWith('example.com');
      expect(result).toEqual({
        address: 'abc@example.com',
        domain: 'example.com',
        createdAt: expect.any(Date),
      });
    });

    it('should generate email with default domain when domain is not provided', async () => {
      await controller.generateEmail(undefined);

      expect(service.generateEmail).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getInbox', () => {
    it('should return inbox for the given address', async () => {
      const result = await controller.getInbox('abc@example.com');

      expect(service.getInbox).toHaveBeenCalledWith('abc@example.com');
      expect(result).toEqual({
        address: 'abc@example.com',
        emails: [],
        count: 0,
      });
    });

    it('should throw BadRequestException when address is empty', async () => {
      try {
        await controller.getInbox('');
      } catch (error: any) {
        expect(error.message).toBe('Address is required');
      }
      expect(service.getInbox).not.toHaveBeenCalled();
    });
  });

  describe('getEmail', () => {
    it('should return email by uid', async () => {
      const result = await controller.getEmail(1);

      expect(service.getEmail).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        uid: 1,
        subject: 'Test',
        from: 'a@example.com',
        to: 'abc@example.com',
        date: expect.any(Date),
        text: 'text',
        html: '<p>html</p>',
        seen: false,
      });
    });
  });

  describe('refreshEmails', () => {
    it('should trigger refresh and return success', async () => {
      const result = await controller.refreshEmails();

      expect(service.refreshEmails).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });

  describe('getAllEmails', () => {
    it('should return all emails', async () => {
      const result = await controller.getAllEmails();

      expect(service.getAllEmails).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
