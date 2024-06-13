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
      include: {
        players: true,
        topic: true,
        result: { include: { points: true } },
      },
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

  async deleteMatch(id: string) {
    const _id = parseInt(id);
    return await this.prismaService.match.delete({
      where: { id: _id },
    });
  }

  async deleteAllMatches() {
    return await this.prismaService.match.deleteMany();
  }

  async resetMatch(id: number) {
    return await this.prismaService.message.deleteMany({
      where: {
        matchId: id,
      },
    });
  }

  async joinMatch(user: User) {
    const name = `Match ${new Date()}`;
    const topicId = Math.floor(Math.random() * 3) + 1; // 1 ~ 3

    // Start a transaction
    const msg = await this.prismaService.$transaction(async (prisma) => {
      // Find a match with less than 2 players
      const onGoingMatches = await prisma.match.findMany({
        where: {
          matchStatus: {
            in: [MatchStatus.CREATED, MatchStatus.START],
          },
        },
        include: { players: true },
      });

      const existingMatch = onGoingMatches.find((match) =>
        match.players.find((p) => p.playerId === user.id),
      );
      if (existingMatch) {
        return { message: 'You are already in a match' };
      }

      const match = onGoingMatches.find((match) => match.players.length < 2);

      if (match) {
        // Join an existing match
        await prisma.match.update({
          where: { id: match.id },
          data: {
            matchStatus: MatchStatus.START,
            players: {
              create: [{ playerId: user.id }],
            },
          },
        });
        return { message: 'You joined a match' };
      } else {
        // Create a new match
        await prisma.match.create({
          data: {
            name: name,
            topicId: topicId,
            firstPlayerId: user.id,
            players: {
              create: [{ playerId: user.id }],
            },
          },
        });
        return { message: 'You created a new match' };
      }
    });
    return msg;
  }

  async cancelMatch(user: User) {
    const waitingMatches = await this.prismaService.match.deleteMany({
      where: {
        matchStatus: {
          in: [MatchStatus.CREATED],
        },
        players: {
          none: {
            NOT: {
              playerId: user.id,
            },
          },
        },
      },
    });
    return waitingMatches;
  }
}
