import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  // TODO: Logger

  constructor(private readonly prismaService: PrismaService) {}

  async findByKey(key: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        key: key,
      },
    });

    if (user == null) {
      /* throw new UserNotFoundError(id); */
      throw new Error(`User not found with key ${key}`);
    }

    return user;
  }

  async createUser(name: string): Promise<User> {
    const user = await this.prismaService.user.create({
      data: {
        name: name,
      },
    });
    return user;
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
    return user;
  }
}
