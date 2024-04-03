import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MatchService } from './match/match.service';
import { MatchController } from './match/match.controller';
import { MatchModule } from './match/match.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, MatchModule],
  controllers: [AppController, MatchController],
  providers: [AppService, MatchService],
})
export class AppModule {}
