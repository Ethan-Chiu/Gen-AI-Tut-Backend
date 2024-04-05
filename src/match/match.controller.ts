import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

  // TODO: guard by admin
  @UseGuards(BasicAuthGuard)
  @Post('create')
  async createMatch(
    @Body() body: { name: string; playerOneId: number; playerTwoId: number },
  ) {
    return await this.matchService.createMatch(
      body.name,
      body.playerOneId,
      body.playerTwoId,
    );
  }

  @UseGuards(ApiKeyGuard)
  @Get('user')
  async getUserWithMatches(@CurrentUser() user: User) {
    return await this.matchService.getUserMatches(user.id);
  }

  @UseGuards(ApiKeyGuard)
  @Get(':id')
  async getMatch(@Param('id') id: string) {
    return await this.matchService.getMatch(id);
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
}
