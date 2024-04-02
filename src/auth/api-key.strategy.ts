import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  Dependencies,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-http-bearer';

@Injectable()
@Dependencies(AuthService)
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'apiKey') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(apiKey: string) {
    const user = await this.authService.validateUser(apiKey);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
