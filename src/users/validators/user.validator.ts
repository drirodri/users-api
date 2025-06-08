import {
  Injectable,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserType } from '../../common/enums/user-type.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserValidator {
  private readonly commonWeakPasswords = [
    'password',
    'password123',
    '123456',
    '123456789',
    'qwerty',
    'abc123',
    'password1',
    'admin',
    'admin123',
    'welcome',
    'welcome123',
    'letmein',
    'monkey',
    'dragon',
    'passw0rd',
  ];

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

  validatePasswordStrength(
    password: string,
    email?: string,
    name?: string,
  ): void {
    if (this.commonWeakPasswords.includes(password.toLowerCase())) {
      throw new BadRequestException(
        'Password is too common and easily guessable. Please choose a stronger password.',
      );
    }

    if (
      email &&
      password.toLowerCase().includes(email.split('@')[0].toLowerCase())
    ) {
      throw new BadRequestException(
        'Password cannot contain your email username.',
      );
    }

    if (name && password.toLowerCase().includes(name.toLowerCase())) {
      throw new BadRequestException('Password cannot contain your name.');
    }

    if (this.hasSequentialCharacters(password)) {
      throw new BadRequestException(
        'Password cannot contain sequential characters (e.g., 123, abc).',
      );
    }

    if (this.hasRepeatedCharacters(password)) {
      throw new BadRequestException(
        'Password cannot contain more than 2 consecutive identical characters.',
      );
    }
  }

  async validatePasswordHistory(
    newPassword: string,
    passwordHistory: string[],
  ): Promise<void> {
    for (const oldPassword of passwordHistory) {
      if (await bcrypt.compare(newPassword, oldPassword)) {
        throw new ConflictException(
          'Password cannot be one of your last 5 passwords. Please choose a different password.',
        );
      }
    }
  }

  async validateCurrentPassword(
    providedCurrentPassword: string,
    actualCurrentPassword: string,
  ): Promise<void> {
    const isCurrentPasswordValid = await bcrypt.compare(
      providedCurrentPassword,
      actualCurrentPassword,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException(
        'Current password is incorrect. Please provide your current password to change it.',
      );
    }
  }

  private hasSequentialCharacters(password: string): boolean {
    const sequences = [
      '0123456789',
      'abcdefghijklmnopqrstuvwxyz',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm',
    ];

    for (const sequence of sequences) {
      for (let i = 0; i <= sequence.length - 3; i++) {
        const subseq = sequence.substring(i, i + 3);
        if (password.toLowerCase().includes(subseq)) {
          return true;
        }
        if (
          password.toLowerCase().includes(subseq.split('').reverse().join(''))
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private hasRepeatedCharacters(password: string): boolean {
    for (let i = 0; i < password.length - 2; i++) {
      if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
        return true;
      }
    }
    return false;
  }
}
