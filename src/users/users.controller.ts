import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { UserType } from 'src/common/enums/user-type.enum';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: plainToClass(UserResponseDto, user),
    };
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      message: 'Users retrieved successfully',
      data: users.map((user) => plainToClass(UserResponseDto, user)),
      count: users.length,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return {
      message: 'User retrieved successfully',
      data: plainToClass(UserResponseDto, user),
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.USER)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser()
    currentUser: { userId: string; email: string; role: UserType },
  ) {
    const user = await this.usersService.update(
      +id,
      updateUserDto,
      currentUser,
    );
    return {
      message: 'User updated successfully',
      data: plainToClass(UserResponseDto, user),
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return {
      message: 'User removed successfully',
    };
  }
}
