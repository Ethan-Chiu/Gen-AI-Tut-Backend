import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ApiKeyGuard)
  @Get()
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Get('list')
  async getUsers() {
    return this.userService.getUsers();
  }

  @Post('create')
  async createUser(@Body() userDto: { name: string }) {
    return this.userService.createUser(userDto.name);
  }

  @Post('delete')
  async deleteUser(@Body() delUserDto: { id: number }) {
    return this.userService.deleteUser(delUserDto.id);
  }
}
