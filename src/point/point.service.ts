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

  async getPointList() {
    const points = await this.prismaService.point.findMany();
    return points;
  }

  async deletePoints(id: string) {
    const _id = parseInt(id);
    return await this.prismaService.point.delete({
      where: {
        id: _id,
      },
    });
  }

  async deleteAllPoints() {
    return await this.prismaService.point.deleteMany({});
  }
}
