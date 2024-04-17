import { Injectable } from '@nestjs/common';
import {
  Instruction,
  Match,
  MatchStatus,
  PlayersOnMatches,
  User,
} from '@prisma/client';
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

  async createMatch(
    name: string,
    playerOneId: number,
    playerTwoId: number,
    topicId: number,
  ) {
    const match = await this.prismaService.match.create({
      data: {
        name: name,
        topicId: topicId,
        firstPlayerId: playerOneId,
        players: {
          create: [{ playerId: playerOneId }, { playerId: playerTwoId }],
        },
      },
    });

    return match;
  }

  async getMatchInfo(
    _id: string,
    userId: number,
  ): Promise<(Match & { isFirst: boolean }) | null> {
    const id: number = parseInt(_id);
    const match = await this.prismaService.match.findUnique({
      where: { id: id },
      include: { players: true, topic: true },
    });

    if (!match.players.find((p) => p.playerId === userId)) return null;

    return {
      ...match,
      isFirst: userId === match.firstPlayerId,
    };
  }

  async getMatch(
    _id: string,
  ): Promise<(Match & { players: PlayersOnMatches[] }) | null> {
    const id: number = parseInt(_id);
    const match = await this.prismaService.match.findUnique({
      where: { id: id },
      include: { players: true, historyMsgs: true },
    });
    return match;
  }

  async getMatchInst(
    _id: string,
    userId: number,
    order: number,
  ): Promise<{ input: string } | null> {
    const id: number = parseInt(_id);
    const match = await this.prismaService.match.findUnique({
      where: { id: id },
      include: { players: true, topic: { include: { instructions: true } } },
    });

    if (match === null) return null;

    if (!match.players.find((p) => p.playerId === userId)) return null;

    const inst: Instruction = match.topic.instructions.find(
      (i) => i.order === order,
    );
    if (inst === undefined) return null;

    return { input: inst.input };
  }

  async sendMessage(matchId: number, user: User, message: string) {
    const match = await this.prismaService.match.findUnique({
      where: { id: matchId, players: { some: { playerId: user.id } } },
    });

    if (match === null) {
      throw new Error('You are not a player in this match');
    }

    return await this.prismaService.message.create({
      data: {
        matchId: matchId,
        userId: user.id,
        text: message,
      },
    });
  }

  async endMatch(id: number) {
    return await this.prismaService.match.update({
      where: { id: id },
      data: {
        matchStatus: MatchStatus.FINISHED,
      },
    });
  }
}
