import { IsNotEmpty, IsNumber, IsPositive, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  @IsPositive({ message: 'Число должно быть больше нуля' })
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  @IsNotEmpty({ message: 'Не должен быть пустым' })
  itemId: number;
}
