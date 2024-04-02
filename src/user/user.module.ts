import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from './user.service';

@Module({
  providers: [PrismaService, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
