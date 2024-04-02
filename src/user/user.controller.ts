import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
