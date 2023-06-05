import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const USER_ALREADY_EXIST =
  'Пользователь с таким email или username уже зарегистрирован';
export const USER_DOES_NOT_EXIST =
  'Пользователь по переданным параметрам не найден';

export const WISH_NOT_FOUND = 'Подарок по переданным параметрам не найден';
export const INVALID_WISH_OWNER =
  'Вы не можете редактировать или удалить чужой подарок или вишлист';
export const RAISED_ALREADY_EXISTS =
  'Нельзя изменять цену - уже есть скинувшиеся';
export const WISH_ALREADY_COPIED = 'Подарок уже сопирован';
export const YOUR_WISH = 'Нельзя скидываться на свои подарки';
export const RAISED_MORE = 'Сумма превышает стоимость подарка, уменьшите взнос';
export const WISHLIST_NOT_FOUND =
  'Список подарков по переданным параметрам не найден';
