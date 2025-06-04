import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserType } from '../common/enums/user-type.enum';
import { UsersRepository } from './repositories/users.repository';
import { UserValidator } from './validators/user.validator';
import { CryptoHelper } from '../common/helpers/crypto.helper';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userValidator: UserValidator,
    private readonly cryptoHelper: CryptoHelper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.usersRepository.existsByEmail(
      createUserDto.email,
    );
    this.userValidator.validateUserDoesNotExist(
      createUserDto.email,
      userExists,
    );

    const hashedPassword = await this.cryptoHelper.hashPassword(
      createUserDto.password,
    );

    return await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(`Users not found: ${error}`);
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser?: { userId: string; email: string; role: UserType },
  ): Promise<User> {
    const user = await this.findOne(id);

    if (currentUser) {
      this.userValidator.validateUpdatePermissions(
        id,
        updateUserDto,
        currentUser,
      );
    }

    if (updateUserDto.password) {
      await this.userValidator.validateNewPassword(
        updateUserDto.password,
        user.password,
      );
      updateUserDto.password = await this.cryptoHelper.hashPassword(
        updateUserDto.password,
      );
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.update(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
