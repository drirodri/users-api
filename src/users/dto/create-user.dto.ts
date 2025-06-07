import 'reflect-metadata';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ enum: UserType, description: 'User role' })
  @IsOptional()
  @IsEnum(UserType, { message: 'userType must be a valid user type' })
  role?: UserType;

  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(6)
  password: string;
}
