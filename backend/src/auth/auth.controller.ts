import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

interface LoginBody {
  username: string;
  password: string;
}

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
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

  @Post('change-password')
  async changePassword(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: ChangePasswordBody,
  ) {
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      throw new UnauthorizedException('Vui lòng nhập đầy đủ mật khẩu');
    }

    return this.authService.changePassword(authHeader, currentPassword, newPassword);
  }
}
