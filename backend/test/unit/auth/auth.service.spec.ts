import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../../src/auth/auth.service';
import * as userStore from '../../../src/models/userStore';

jest.mock('../../../src/models/userStore');

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function mockAdminUser(password: string) {
    return {
      id: 1,
      username: 'admin',
      password,
      role: 'master_admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  describe('changePassword', () => {
    it('should change password with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      jest
        .spyOn(userStore, 'findUserByUsername')
        .mockResolvedValueOnce(mockAdminUser(hashedPassword));
      jest.spyOn(userStore, 'updateUserPassword').mockResolvedValueOnce(true);

      const result = await service.changePassword(
        'Bearer admin:123:abc',
        'admin123',
        'newpassword',
      );

      expect(result.success).toBe(true);
      expect(userStore.updateUserPassword).toHaveBeenCalled();
    });

    it('should throw when current password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      jest
        .spyOn(userStore, 'findUserByUsername')
        .mockResolvedValueOnce(mockAdminUser(hashedPassword));

      await expect(
        service.changePassword('Bearer admin:123:abc', 'wrongpassword', 'newpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when token is missing', async () => {
      await expect(
        service.changePassword(undefined, 'admin123', 'newpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return token and user on valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      jest
        .spyOn(userStore, 'findUserByUsername')
        .mockResolvedValueOnce(mockAdminUser(hashedPassword));

      const result = await service.login({ username: 'admin', password: 'admin123' });

      expect(result.user.username).toBe('admin');
      expect(result.token).toContain('admin:');
    });

    it('should throw on invalid credentials', async () => {
      jest.spyOn(userStore, 'findUserByUsername').mockResolvedValueOnce(null);

      await expect(
        service.login({ username: 'admin', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateToken', () => {
    it('should return true for a valid token', async () => {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      jest
        .spyOn(userStore, 'findUserByUsername')
        .mockResolvedValueOnce(mockAdminUser(hashedPassword));

      const { token } = await service.login({ username: 'admin', password: 'admin123' });
      expect(service.validateToken(token, 'admin')).toBe(true);
    });

    it('should return false for an invalid token', () => {
      expect(service.validateToken('invalid-token', 'admin')).toBe(false);
    });
  });
});
