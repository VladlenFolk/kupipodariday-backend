import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import {
  WISH_NOT_FOUND,
  YOUR_WISH,
  RAISED_MORE,
} from 'src/utils/constants/constants';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.getWishById(createOfferDto.itemId);
    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }
    if (user.id === wish.owner.id) {
      throw new BadRequestException(YOUR_WISH);
    }
    const updatedRaised = wish.raised + createOfferDto.amount;
    if (updatedRaised > wish.price) {
      throw new BadRequestException(RAISED_MORE);
    }
    await this.wishesService.setRaised(wish.id, updatedRaised);
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });
    return await this.offersRepository.save(offer);
  }

  findMany(query: FindManyOptions<Offer>) {
    return this.offersRepository.find(query);
  }

  findOne(query: FindOneOptions<Offer>) {
    return this.offersRepository.findOne(query);
  }

  getAllOffers() {
    return this.findMany({
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }

  getOfferById(id: number) {
    return this.findOne({
      where: { id },
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }
}
