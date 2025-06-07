import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../common/enums/user-type.enum';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ enum: UserType })
  @Expose()
  userType: UserType;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty({ enum: UserType })
  @Expose()
  role: UserType;

  @Exclude()
  password: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
