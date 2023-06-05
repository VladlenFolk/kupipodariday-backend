import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @Length(2, 30, { message: 'должен быть не меньше 2 и не больше 30' })
  username: string;

  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  @Length(2, 200, { message: 'должен быть не меньше 2 и не больше 200' })
  about: string;

  @IsOptional()
  @IsUrl({ message: 'Не корректный URL' })
  avatar: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @IsEmail({}, { message: 'Не корректный email' })
  email: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @MinLength(6, { message: 'должен быть больше 6' })
  password: string;
}
