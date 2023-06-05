import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from 'src/utils/constants/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findOne({
      where: { id: jwtPayload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('Некорректный логин или пароль');
    }
    return user;
  }
}
