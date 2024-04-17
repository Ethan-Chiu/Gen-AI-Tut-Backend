import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(_id: string) {
    const id = parseInt(_id);

    const topic = await this.prismaService.topic.findUnique({
      where: {
        id: id,
      },
      include: {
        instructions: true,
      },
    });
    return topic;
  }

  async createTopic(description: string) {
    return await this.prismaService.topic.create({
      data: {
        description: description,
      },
    });
  }

  async createInstruction(topicId: number, order: number, input: string) {
    return await this.prismaService.instruction.create({
      data: {
        topicId: topicId,
        order: order,
        input: input,
      },
    });
  }
}
