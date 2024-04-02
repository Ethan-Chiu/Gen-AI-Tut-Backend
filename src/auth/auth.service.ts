import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(apiKey: string): Promise<User | null> {
    try {
      const user = await this.userService.findByKey(apiKey);
      return user;
    } catch (error) {
      // TODO: log error
      return null;
    }
  }
}
