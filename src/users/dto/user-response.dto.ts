import { Exclude, Expose } from 'class-transformer';
import { UserType } from '../../common/enums/user-type.enum';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  userType: UserType;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
