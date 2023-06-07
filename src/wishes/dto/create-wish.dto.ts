import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsUrl,
  IsPositive,
  IsNumber,
} from 'class-validator';

export class CreateWishDto {
  @IsString({ message: 'Должно быть строкой' })
  @Length(1, 250, { message: 'должен быть не меньше 1 и не больше 250' })
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  name: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty()
  @IsUrl({ message: 'Не корректный URL' })
  link: string;

  @IsUrl({ message: 'Не корректный URL' })
  @IsOptional()
  image: string;

  @IsPositive({ message: 'Число должно быть больше нуля' })
  @IsNumber()
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  price: number;

  @IsString()
  @Length(1, 1024, { message: 'должен быть не меньше 1 и не больше 1024' })
  description: string;
}
