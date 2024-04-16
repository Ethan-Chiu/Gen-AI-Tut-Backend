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
}
