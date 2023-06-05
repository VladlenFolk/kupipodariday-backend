import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  getAllWishlists() {
    return this.wishlistsService.getAllWishlists();
  }

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishlistsService.getWishlistById(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() { user }: { user: User },
  ) {
    return await this.wishlistsService.updateWishList(
      Number(id),
      updateWishlistDto,
      user,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishlistsService.deleteWishlist(Number(id), req.user.id);
  }
}
