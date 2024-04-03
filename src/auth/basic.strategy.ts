import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  Dependencies,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
@Dependencies(AuthService)
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const auth = await this.authService.validateUserWithPass(
      username,
      password,
    );
    if (!auth) {
      throw new UnauthorizedException();
    }
    return auth;
  }
}
