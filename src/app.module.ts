import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MatchService } from './match/match.service';
import { MatchController } from './match/match.controller';
import { MatchModule } from './match/match.module';
import { TopicModule } from './topic/topic.module';
import { TopicController } from './topic/topic.controller';
import { ResultController } from './result/result.controller';
import { ResultModule } from './result/result.module';
import { PointModule } from './point/point.module';
import { PointController } from './point/point.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    MatchModule,
    TopicModule,
    ResultModule,
    PointModule,
  ],
  controllers: [
    AppController,
    MatchController,
    TopicController,
    ResultController,
    PointController,
  ],
  providers: [AppService, MatchService],
})
export class AppModule {}
