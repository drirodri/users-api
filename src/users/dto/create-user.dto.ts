import 'reflect-metadata';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserType } from '../../common/enums/user-type.enum';

export class CreateUserDto {
  @IsOptional()
  @IsEnum(UserType, { message: 'userType must be a valid user type' })
  role?: UserType;

  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6)
  password: string;
}
