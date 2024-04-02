import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './api-key.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, ApiKeyStrategy],
})
export class AuthModule {}
