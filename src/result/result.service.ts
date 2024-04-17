import { Injectable } from '@nestjs/common';
import { MatchStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResultService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(_id: string) {
    const id = parseInt(_id);

    const result = await this.prismaService.result.findUnique({
      where: {
        id: id,
      },
      include: {
        winner: true,
      },
    });
    return result;
  }

  async submitResult(winnerId: number, comment: string, matchId: number) {
    const result = await this.prismaService.result.create({
      data: {
        winnerId: winnerId,
        comment: comment,
        matchId: matchId,
      },
    });

    await this.prismaService.match.update({
      where: {
        id: matchId,
      },
      data: {
        matchStatus: MatchStatus.GRADED,
      },
    });

    return result;
  }
}
