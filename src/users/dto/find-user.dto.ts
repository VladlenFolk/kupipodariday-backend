import { IsNotEmpty } from 'class-validator';

export class FindUserDto {
  @IsNotEmpty()
  public query: string;
}
