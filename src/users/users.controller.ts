import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UsersService } from './users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { USER_DOES_NOT_EXIST } from 'src/utils/constants/constants';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  async getProfile(@Req() { user }: { user: User }): Promise<User> {
    const profile = await this.usersService.findOneById(user.id);
    if (!profile) {
      throw new NotFoundException(USER_DOES_NOT_EXIST);
    }
    return profile;
  }

  @Patch('me')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() { user }: { user: User },
  ): Promise<User> {
    return this.usersService.updateOne(user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getWishes(@Req() req): Promise<Wish[]> {
    return this.wishesService.findUserByOwner(req.user.id);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.getUserByUsername(username);
  }

  @Get(':username/wishes')
  async getOtherUserWishes(@Param('username') username: string) {
    const user = await this.usersService.findOneByUsername(username);
    return await this.wishesService.findUserByOwner(user.id);
  }

  @Post('find')
  async findMany(@Body() findUsersDto: FindUserDto): Promise<User[]> {
    return this.usersService.findMany(findUsersDto);
  }
}
