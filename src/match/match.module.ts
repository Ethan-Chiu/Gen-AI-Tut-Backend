import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [PrismaModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
