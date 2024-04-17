import { Controller, Get, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from 'src/auth/basic.guard';
import { PointService } from './point.service';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @UseGuards(BasicAuthGuard)
  @Get('all')
  async getPoints() {
    return this.pointService.getPoints();
  }
}
