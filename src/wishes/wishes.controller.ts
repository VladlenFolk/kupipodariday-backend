import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { Wish } from './entities/wish.entity';
import {
  INVALID_WISH_OWNER,
  RAISED_ALREADY_EXISTS,
} from 'src/utils/constants/constants';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(@Body() createWishDto: CreateWishDto, @Req() req) {
    return await this.wishesService.create(req.user, createWishDto);
  }

  @Get('last')
  async getWishesLast() {
    return await this.wishesService.getWishesLast();
  }

  @Get('top')
  async getTopWishes() {
    return await this.wishesService.getWishesTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.getWishById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.getWishById(id);
    if (req.user.id !== wish.owner.id) {
      throw new ForbiddenException(INVALID_WISH_OWNER);
    }
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(RAISED_ALREADY_EXISTS);
    }
    return await this.wishesService.updateWish(Number(id), updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.remove(Number(id), req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  public async copyWish(@Req() req, @Param('id') id: number) {
    const wish = await this.wishesService.getWishById(id);
    await this.wishesService.updateWish(id, { copied: ++wish.copied });
    const { name, link, image, price, description } = wish;
    if (wish.owner.id !== req.user.id) {
      await this.wishesService.create(req.user, {
        name,
        link,
        image,
        price,
        description,
      });
    }
    return {};
  }
}
