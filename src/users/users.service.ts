import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { USER_ALREADY_EXIST } from 'src/utils/constants/constants';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOne(query);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;
    const user = await this.findOne({ where: [{ email }, { username }] });
    if (user) {
      throw new ConflictException(USER_ALREADY_EXIST);
    }
    const hashedPassword = await this.hashService.getHash(password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    return user;
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const user = await this.usersRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (user) {
        throw new ConflictException(USER_ALREADY_EXIST);
      }
    }
    if (
      updateUserDto.password !== undefined &&
      updateUserDto.password !== ' '
    ) {
      updateUserDto.password = await this.hashService.getHash(
        updateUserDto.password,
      );
    }
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const anotherUser = await this.findOneByUsername(updateUserDto.username);
      if (anotherUser) {
        throw new ConflictException(USER_ALREADY_EXIST);
      }
    }
    return await this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async getUserByUsername(username: string) {
    return await this.findOne({
      where: { username },
    });
  }

  async getOtherUserWishes(username: string) {
    const otherUser = await this.findOne({
      where: { username },
      relations: {
        wishes: true,
      },
    });
    return otherUser;
  }

  findMany({ query }: { query: string }) {
    const users = this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return users;
  }
}
