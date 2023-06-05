import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, In } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import {
  WISH_NOT_FOUND,
  INVALID_WISH_OWNER,
} from 'src/utils/constants/constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async findUserByOwner(ownerId: number): Promise<Wish[]> {
    return await this.wishesRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['offers', 'owner'],
    });
  }

  async findOne(query: FindOneOptions<Wish>) {
    return await this.wishesRepository.findOne(query);
  }

  async create(user: User, createWishDto: CreateWishDto) {
    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });
    return wish;
  }

  async getWishesLast() {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: ['owner'],
    });
  }

  async getWishesTop() {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
      relations: ['owner'],
    });
  }

  async setRaised(id: number, updatedRaised: number) {
    return await this.wishesRepository.update(id, { raised: updatedRaised });
  }

  async getWishById(id: number) {
    const wish = await this.wishesRepository.findOne({
      relations: {
        owner: { wishes: true, wishlists: true, offers: true },
        offers: { user: true },
      },
      where: { id },
    });
    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }
    return wish;
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto) {
    return this.wishesRepository.update(id, updateWishDto);
  }

  async remove(id: number, ownerId: number) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (ownerId !== wish.owner.id) {
      throw new ForbiddenException(INVALID_WISH_OWNER);
    }
    this.wishesRepository.delete(id);
    return wish;
  }

  async findMany(idArray: number[]) {
    const wishes = await this.wishesRepository.find({
      where: { id: In(idArray) },
    });
    if (wishes.length === 0) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }
    return wishes;
  }
}
