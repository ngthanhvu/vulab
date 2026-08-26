import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../models/userStore';
import { hashPassword } from '../utils/password';

interface CreateUserBody {
  username: string;
  password: string;
  role?: string;
}

interface UpdateUserBody {
  username?: string;
  password?: string;
  role?: string;
}

@Controller('api/users')
export class UsersController {
  @Get()
  async list() {
    return getAllUsers();
  }

  @Post()
  async create(@Body() body: CreateUserBody) {
    const { username, password, role = 'admin' } = body;

    if (!username || !password) {
      throw new BadRequestException('Username và password là bắt buộc');
    }

    const hashedPassword = await hashPassword(password);
    const user = await createUser(username, hashedPassword, role);
    return user;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserBody,
  ) {
    const updates = { ...body };
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }
    const user = await updateUser(id, updates);
    return user;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await deleteUser(id);
    return { success: true };
  }
}
