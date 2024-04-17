import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PointService } from './point.service';
import { PointController } from './point.controller';

@Module({
  providers: [PrismaService, PointService],
  controllers: [PointController],
  exports: [PointService],
})
export class PointModule {}
