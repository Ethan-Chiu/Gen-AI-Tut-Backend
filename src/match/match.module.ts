import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { ResultService } from 'src/result/result.service';

@Module({
  imports: [PrismaModule],
  controllers: [MatchController],
  providers: [MatchService, ResultService],
})
export class MatchModule {}
