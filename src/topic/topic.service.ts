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

  async findAll() {
    return await this.prismaService.topic.findMany();
  }

  async getInstructions() {
    return await this.prismaService.instruction.findMany();
  }

  async deleteTopic(id: string) {
    return await this.prismaService.topic.delete({
      where: {
        id: parseInt(id),
      },
    });
  }

  async deleteInstruction(id: string) {
    return await this.prismaService.instruction.delete({
      where: {
        id: parseInt(id),
      },
    });
  }
}
