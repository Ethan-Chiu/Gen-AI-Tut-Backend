import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  providers: [PrismaService, TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
