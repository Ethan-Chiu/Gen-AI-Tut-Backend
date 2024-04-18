import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { ApiKeyGuard } from 'src/auth/api-key.guard';
import { CurrentUser } from 'src/auth/current-user';
import { User } from '@prisma/client';
import { BasicAuthGuard } from 'src/auth/basic.guard';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @UseGuards(BasicAuthGuard)
  @Get('list')
  async getMatches() {
    return await this.matchService.getMatches();
  }

  @UseGuards(BasicAuthGuard)
  @Post('create')
  async createMatch(
    @Body()
    body: {
      name: string;
      playerOneId: number;
      playerTwoId: number;
      topicId: number;
    },
  ) {
    return await this.matchService.createMatch(
      body.name,
      body.playerOneId,
      body.playerTwoId,
      body.topicId,
    );
  }

  @UseGuards(ApiKeyGuard)
  @Get('user')
  async getUserWithMatches(@CurrentUser() user: User) {
    return await this.matchService.getUserMatches(user.id);
  }

  @UseGuards(ApiKeyGuard)
  @Get('info/:id')
  async getMatchInfo(@CurrentUser() user: User, @Param('id') id: string) {
    const match = await this.matchService.getMatchInfo(id, user.id);
    if (match === null) {
      throw new BadRequestException("Match not found, or you're not a player");
    }
    return match;
  }

  @UseGuards(ApiKeyGuard)
  @Get(':id')
  async getMatch(@CurrentUser() user: User, @Param('id') id: string) {
    const match = await this.matchService.getMatch(id);

    if (match === null) {
      throw new BadRequestException('Match not found');
    }

    if (!match.players.find((p) => p.playerId === user.id)) {
      throw new BadRequestException("You're not a player");
    }

    return match;
  }

  @UseGuards(BasicAuthGuard)
  @Get('/admin/:id')
  async getMatchAdmin(@Param('id') id: string) {
    const match = await this.matchService.getMatch(id);

    if (match === null) {
      throw new BadRequestException('Match not found');
    }
    return match;
  }

  @UseGuards(ApiKeyGuard)
  @Get('/inst/:id')
  async getMatchInstruction(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { order: number },
  ) {
    return await this.matchService.getMatchInst(id, user.id, body.order);
  }

  @UseGuards(ApiKeyGuard)
  @Post('sendmsg')
  async sendMessage(
    @CurrentUser() user: User,
    @Body() body: { matchId: number; message: string },
  ) {
    return await this.matchService.sendMessage(
      body.matchId,
      user,
      body.message,
    );
  }

  @UseGuards(ApiKeyGuard)
  @Post('end')
  async endMatch(@CurrentUser() user: User, @Body() body: { matchId: number }) {
    return await this.matchService.endMatch(body.matchId);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('delete/:id')
  async deleteMatch(@Param('id') id: string) {
    return await this.matchService.deleteMatch(id);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('all/delete')
  async deleteAllMatches() {
    return await this.matchService.deleteAllMatches();
  }
}
