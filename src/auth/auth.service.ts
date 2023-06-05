import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.userService.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Некорректный логин или пароль');
    }
    const isValidate = await this.hashService.compare(password, user.password);
    if (isValidate) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...restUserData } = user;
      return restUserData;
    }
    return null;
  }
}
