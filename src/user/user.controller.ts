import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user';
import { BasicAuthGuard } from 'src/auth/basic.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ApiKeyGuard)
  @Get()
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(ApiKeyGuard)
  @Post('rename')
  async renameUser(
    @CurrentUser() user: User,
    @Body() userDto: { name: string },
  ) {
    return this.userService.renameUser(user.id, userDto.name);
  }

  @UseGuards(BasicAuthGuard)
  @Get('list')
  async getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(BasicAuthGuard)
  @Post('create')
  async createUser(@Body() userDto: { name: string }) {
    return this.userService.createUser(userDto.name);
  }

  @UseGuards(BasicAuthGuard)
  @Post('delete')
  async deleteUser(@Body() delUserDto: { id: number }) {
    return this.userService.deleteUser(delUserDto.id);
  }
}
