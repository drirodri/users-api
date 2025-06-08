import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { UserType } from '../../common/enums/user-type.enum';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: 1,
    type: 'integer',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    maxLength: 100,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: UserType,
    example: UserType.USER,
  })
  @Expose()
  role: UserType;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2024-01-20T14:45:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Expose()
  updatedAt: Date;
}
