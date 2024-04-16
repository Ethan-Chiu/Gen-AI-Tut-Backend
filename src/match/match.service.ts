import { Injectable } from '@nestjs/common';
import { Instruction, Match, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMatches() {
    return await this.prismaService.match.findMany();
  }

  async getUserMatches(userId: number): Promise<Match[]> {
    return await this.prismaService.match.findMany({
      where: {
        players: { some: { playerId: userId } },
      },
    });
  }

  async createMatch(name: string, playerOneId: number, playerTwoId: number, topicId: number) {
    const match = await this.prismaService.match.create({
      data: {
        name: name,
        topicId: topicId, 
        players: {
          create: [{ playerId: playerOneId }, { playerId: playerTwoId }],
        },
      },
    });

    return match;
  }

  async getMatch(_id: string, userId: number): Promise<Match | null> {
    const id: number = parseInt(_id);
    const match = await this.prismaService.match.findUnique({
      where: { id: id },
      include: { players: true, historyMsgs: true },
    });

    if (match.players.find((p) => p.playerId === userId))
      return match;
    return null;
  }

  async getMatchInst(_id: string, userId: number, order: number): Promise<string | null> {
    const id: number = parseInt(_id);
    const match = await this.prismaService.match.findUnique({
      where: { id: id },
      include: { players: true, topic: { include: { instructions: true }} },
    });

    if (match === null) return null;
    if (!(match.players.find((p) => p.playerId === userId))) {
      return null;
    }

    const inst: Instruction = match.topic.instructions.find((i) => i.order === order);
    if (inst === undefined) return null;

    return inst.input;
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
