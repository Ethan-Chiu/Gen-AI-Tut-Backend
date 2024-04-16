import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from 'src/auth/basic.guard';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @UseGuards(BasicAuthGuard)
  @Get(':id')
  async getTopic(@Param('id') id: string) {
    return this.topicService.findById(id);
  }
}
