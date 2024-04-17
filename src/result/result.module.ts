import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';

@Module({
  providers: [PrismaService, ResultService],
  controllers: [ResultController],
  exports: [ResultService],
})
export class ResultModule {}
