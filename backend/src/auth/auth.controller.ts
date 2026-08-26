import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

interface LoginBody {
  username: string;
  password: string;
}

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginBody) {
    const { username, password } = body;

    if (!username || !password) {
      throw new UnauthorizedException('Vui lòng nhập đầy đủ thông tin');
    }

    return this.authService.login({ username, password });
  }
}
