import { PartialType, OmitType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsStrongPassword,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserType } from '../../common/enums/user-type.enum';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe Updated',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @Matches(/^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\s'-]+$/, {
    message: 'Name can only contain letters, spaces, apostrophes, and hyphens',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'User email address (must be unique)',
    example: 'updated@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email?: string;

  @ApiPropertyOptional({
    description:
      'New password (minimum 6 characters, must contain uppercase, lowercase, number, and special character)',
    example: 'NewSecurePass123!',
    minLength: 6,
    format: 'password',
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password?: string;

  @ApiPropertyOptional({
    description: 'User role in the system (only ADMIN users can modify roles)',
    enum: UserType,
    example: UserType.USER,
  })
  @IsOptional()
  @IsEnum(UserType, {
    message: `Role must be one of the following values: ${Object.values(UserType).join(', ')}`,
  })
  role?: UserType;
}
