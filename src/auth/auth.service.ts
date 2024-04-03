import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUserWithKey(apiKey: string): Promise<User | null> {
    try {
      const user = await this.userService.findByKey(apiKey);
      return user;
    } catch (error) {
      // TODO: log error
      return null;
    }
  }

  async validateUserWithPass(username: string, pass: string): Promise<boolean> {
    /* console.log('validateUserWithPass', username, pass); */

    if (!process.env.ADMIN_PASSWORD) {
      console.log("Admin password isn't set");
      return false;
    }

    if (username === 'admin' && pass === process.env.ADMIN_PASSWORD) {
      return true;
    }

    return false;
  }
}
