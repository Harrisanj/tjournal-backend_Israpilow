import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  fullName: string;

  @IsEmail(undefined, { message: 'Неверная почта' })
  email: string;

  @Length(6, 50, { message: 'Минимум 6 символов' })
  password?: string;
}
