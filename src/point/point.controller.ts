import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
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

  @UseGuards(BasicAuthGuard)
  @Get('list')
  async getPointList() {
    return this.pointService.getPointList();
  }

  @UseGuards(BasicAuthGuard)
  @Delete('delete/:id')
  async deletePoint(@Param('id') id: string) {
    return this.pointService.deletePoints(id);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('all/delete')
  async deleteAllPoints() {
    return this.pointService.deleteAllPoints();
  }
}
