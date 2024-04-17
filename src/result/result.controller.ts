import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from 'src/auth/basic.guard';
import { ResultService } from './result.service';
import { ApiKeyGuard } from 'src/auth/api-key.guard';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @UseGuards(ApiKeyGuard)
  @Get(':id')
  async getResult(@Param('id') id: string) {
    return this.resultService.findById(id);
  }

  @UseGuards(BasicAuthGuard)
  @Post('submit')
  async submitResult(
    @Body()
    resultDto: {
      winnerId: number;
      comment: string;
      matchId: number;
      points: { userId: number; points: number }[];
    },
  ) {
    return this.resultService.submitResult(
      resultDto.winnerId,
      resultDto.comment,
      resultDto.matchId,
      resultDto.points,
    );
  }
}
