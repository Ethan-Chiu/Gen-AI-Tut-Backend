import { Injectable } from '@nestjs/common';
import {
  Instruction,
  Match,
  MatchStatus,
  PlayersOnMatches,
  User,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResultService } from 'src/result/result.service';

type MessageResponse = {
  message: string;
};
@Injectable()
export class MatchService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly resultService: ResultService,
  ) {}

  async getMatches() {
    return await this.prismaService.match.findMany({
      include: {
        players: {
          include: {
            player: true,
          },
        },
        topic: true,
        historyMsgs: true,
        result: {
          include: {
            points: true,
          },
        },
      },
    });
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
    const result: MessageResponse = await this.prismaService.$transaction(
      async (prisma) => {
        const match = await prisma.match.findUnique({
          where: {
            id: matchId,
            players: { some: { playerId: user.id } },
          },
          include: { historyMsgs: true },
        });

        if (match === null) {
          return { message: 'You are not a player in this match' };
        }

        const messageList = match.historyMsgs.sort(
          (a, b) => a.createAt.getTime() - b.createAt.getTime(),
        );

        if (messageList.length == 0 && user.id != match.firstPlayerId) {
          return { message: 'You are not the first player' };
        }

        if (messageList[messageList.length - 1]?.userId === user.id) {
          return { message: 'You already sent a message' };
        }

        const resMessage = await prisma.message.create({
          data: {
            matchId: matchId,
            userId: user.id,
            text: message,
          },
        });
        return {
          message: `Created message: ${resMessage.text}`,
        };
      },
    );

    return result;
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
    const msg: MessageResponse = await this.prismaService.$transaction(
      async (prisma) => {
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
      },
    );
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

  async opponentTookTooLong(user: User) {
    // Find a match with two players in the status of START
    const onGoingMatches = await this.prismaService.match.findMany({
      where: {
        matchStatus: {
          in: [MatchStatus.START],
        },
        players: {
          some: {
            playerId: user.id,
          },
        },
      },
      include: { players: true },
    });

    if (onGoingMatches.length === 0) {
      return { msg: 'You are not in a match that is in progress' };
    }

    if (onGoingMatches.length !== 1) {
      return { msg: 'Some thing went wrong, you are in multiple matches' };
    }

    if (onGoingMatches[0].players.length !== 2) {
      return { msg: 'Some thing went wrong, players in the match are not 2' };
    }

    const match = onGoingMatches[0];
    const reported_player =
      match.players[0].playerId === user.id
        ? match.players[1]
        : match.players[0];

    // TODO: to be recorded in database
    console.log(
      'Match id: ',
      match.id,
      'Report player Id: ',
      user.id,
      'Reported player Id: ',
      reported_player.playerId,
    );

    // Give points
    this.resultService.submitResult(
      user.id,
      'Opponent took too long',
      match.id,
      [{ userId: user.id, points: 5 }],
    );
  }
}
