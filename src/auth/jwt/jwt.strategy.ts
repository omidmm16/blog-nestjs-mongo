import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import { JwtPayload } from './jwtPayload.interface';
import { UsersService } from '../../users/users.service';
import { UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }

  async validate({ username }: JwtPayload): Promise<UserDocument> {
    const user = await this.usersService.getUser({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}