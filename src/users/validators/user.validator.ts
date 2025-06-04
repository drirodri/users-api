import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserType } from '../../common/enums/user-type.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserValidator {
  validateUserDoesNotExist(email: string, userExists: boolean): void {
    if (userExists) {
      throw new ConflictException('User already exists');
    }
  }

  validateUpdatePermissions(
    userId: number,
    updateUserDto: UpdateUserDto,
    currentUser: { userId: string; email: string; role: UserType },
  ): void {
    const isAdmin = currentUser.role === UserType.ADMIN;
    const isOwner = parseInt(currentUser.userId) === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (updateUserDto.role && !isAdmin) {
      throw new ForbiddenException('Only administrators can change user roles');
    }
  }

  async validateNewPassword(
    newPassword: string,
    currentPassword: string,
  ): Promise<void> {
    if (await bcrypt.compare(newPassword, currentPassword)) {
      throw new ConflictException(
        'New password cannot be the same as the old one',
      );
    }
  }
}
