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

    const user = await createUser(username, password, role);
    return user;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserBody,
  ) {
    const user = await updateUser(id, body);
    return user;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await deleteUser(id);
    return { success: true };
  }
}
