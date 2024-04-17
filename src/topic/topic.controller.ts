import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

  @UseGuards(BasicAuthGuard)
  @Post('create')
  async createTopic(@Body() topicDto: { description: string }) {
    return this.topicService.createTopic(topicDto.description);
  }

  @UseGuards(BasicAuthGuard)
  @Post('createInst')
  async createInstruction(
    @Body() instDto: { topicId: number; order: number; input: string },
  ) {
    return this.topicService.createInstruction(
      instDto.topicId,
      instDto.order,
      instDto.input,
    );
  }
}
