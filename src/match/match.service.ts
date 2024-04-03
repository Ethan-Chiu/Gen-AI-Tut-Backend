import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMatches() {
    return await this.prismaService.match.findMany();
  }

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

  async getMatch(_id: string) {
    const id: number = parseInt(_id);
    return await this.prismaService.match.findUnique({ where: { id: id } });
  }

  async sendMessage(matchId: number, user: User, message: string) {
    return await this.prismaService.message.create({
      data: {
        matchId: matchId,
        userId: user.id,
        text: message,
      },
    });
  }
}