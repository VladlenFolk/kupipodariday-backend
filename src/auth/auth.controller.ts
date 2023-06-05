import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local/local.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req) {
    return this.authService.auth(req.user);
  }

  @UsePipes(ValidationPipe)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }
}
