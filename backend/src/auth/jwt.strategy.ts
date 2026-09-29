import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'volunteer_hub_secret',
    });
    console.log('JwtStrategy initialized!');
  }

  async validate(payload: { sub: string; role: string }) {
    try {
      console.log('JwtStrategy.validate payload:', payload);
      const user = await this.authService.validateUser(payload.sub);
      console.log('JwtStrategy.validate user:', user);
      if (!user) {
        console.log('User not found!');
      }
      return user;
    } catch (err) {
      console.error('JwtStrategy.validate ERROR:', err);
      throw err;
    }
  }
}
