import { Injectable, UnauthorizedException } from '@nestjs/common';
import { findUserByUsername } from '../models/userStore';

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
    if (!user || user.password !== password) {
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
}
