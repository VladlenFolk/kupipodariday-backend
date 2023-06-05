import {
  IsString,
  IsNotEmpty,
  Length,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @Length(1, 250, { message: 'должен быть не меньше 1 и не больше 250' })
  @IsString({ message: 'Должно быть строкой' })
  name: string;

  @IsString({ message: 'Должно быть строкой' })
  @Length(1500)
  description: string;

  @IsString({ message: 'Должно быть строкой' })
  image: string;

  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @ArrayNotEmpty()
  @IsArray({ message: 'Должно быть массивом' })
  @IsString({ each: true })
  itemsId: number[];
}
