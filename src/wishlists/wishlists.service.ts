import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import {
  INVALID_WISH_OWNER,
  WISHLIST_NOT_FOUND,
} from 'src/utils/constants/constants';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistsRepository.findOne(query);
  }

  findMany(query: FindManyOptions<Wishlist>) {
    return this.wishlistsRepository.find(query);
  }

  getAllWishlists() {
    return this.findMany({
      relations: ['items', 'owner'],
    });
  }

  create(createWishlistDto: CreateWishlistDto, ownerId: number) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const wishList = this.wishlistsRepository.create({
      ...rest,
      items,
      owner: { id: ownerId },
    });
    return this.wishlistsRepository.save(wishList);
  }

  getWishlistById(id: number) {
    return this.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  async updateWishList(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ) {
    const { name, itemsId, description, image } = updateWishlistDto;
    let wishes: Wish[];
    if (itemsId) {
      wishes = await this.wishesService.findMany(itemsId);
    }
    const wishlist = await this.getWishlistById(id);
    if (!wishlist) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }
    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException(INVALID_WISH_OWNER);
    }
    await this.wishlistsRepository.save({
      id,
      name,
      items: wishes,
      description,
      image,
    });
    return this.getWishlistById(id);
  }

  async deleteWishlist(id: number, userId: number) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(INVALID_WISH_OWNER);
    }
    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
