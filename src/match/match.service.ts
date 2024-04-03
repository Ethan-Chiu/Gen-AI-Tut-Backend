import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMatch(name: string, playerOneId: number, playerTwoId: number) {
    const match = await this.prismaService.match.create({
      data: {
        name: name,
        players: {
          create: [{ playerId: playerOneId }, { playerId: playerTwoId }],
        },
      },
    });

    return match;
  }
}
