import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PointService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPoints() {
    const points = await this.prismaService.point.findMany();

    const aggregatedData: {
      [userId: number]: { userId: number; point: number };
    } = {};

    points.forEach((item) => {
      const { userId, point } = item;
      if (userId in aggregatedData) {
        aggregatedData[userId].point += point;
      } else {
        aggregatedData[userId] = { userId, point };
      }
    });

    // Convert dictionary values to list
    const aggregatedList: { userId: number; point: number }[] =
      Object.values(aggregatedData);
    return aggregatedList;
  }
}
