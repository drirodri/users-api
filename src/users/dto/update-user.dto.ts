import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserType } from '../../common/enums/user-type.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ enum: UserType })
  @IsNotEmpty({ message: 'role is required' })
  @IsEnum(UserType, { message: 'userType must be a valid user type' })
  role: UserType;
}
