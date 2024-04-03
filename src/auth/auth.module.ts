import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './api-key.strategy';
import { BasicStrategy } from './basic.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, ApiKeyStrategy, BasicStrategy],
})
export class AuthModule {}
