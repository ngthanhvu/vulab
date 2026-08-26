import { Injectable, UnauthorizedException } from '@nestjs/common';
import { findUserByUsername, updateUserPassword } from '../models/userStore';
import { comparePassword, hashPassword } from '../utils/password';

interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: {
    username: string;
  };
}

@Injectable()
export class AuthService {
  async login(payload: LoginPayload): Promise<AuthResult> {
    const { username, password } = payload;

    const user = await findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const token = this.generateToken(username);

    return {
      token,
      user: {
        username,
      },
    };
  }

  private generateToken(username: string): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return `${username}:${timestamp}:${random}`;
  }

  validateToken(token: string, username: string): boolean {
    if (!token || !token.startsWith(`${username}:`)) {
      return false;
    }
    return true;
  }

  async changePassword(
    authHeader: string | undefined,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    const username = this.extractUsernameFromToken(authHeader);
    if (!username) {
      throw new UnauthorizedException('Vui lòng đăng nhập lại');
    }

    const user = await findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    const hashedPassword = await hashPassword(newPassword);
    await updateUserPassword(user.id, hashedPassword);

    return { success: true };
  }

  private extractUsernameFromToken(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : authHeader;
    if (!token) return null;
    return token.split(':')[0] || null;
  }
}
