import { Body, Controller, Post } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // TODO: guard by admin
  @Post('create')
  createMatch(
    @Body() body: { name: string; playerOneId: number; playerTwoId: number },
  ) {
    return this.matchService.createMatch(
      body.name,
      body.playerOneId,
      body.playerTwoId,
    );
  }
}
