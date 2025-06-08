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
  HttpCode,
  HttpStatus,
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  ApiCreateUserResponses,
  ApiUpdateUserResponses,
  ApiUserCrudResponses,
  ApiGetAllUsersResponses,
} from '../common/decorators/api-responses.decorator';

@ApiBearerAuth()
@ApiTags('users')
@ApiExtraModels(UserResponseDto)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard) // Apply authentication to entire controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Only users with the ADMIN role can access this endpoint.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreateUserResponses()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: plainToClass(UserResponseDto, user),
    };
  }

  @ApiOperation({
    summary: 'Retrieve all users',
    description: 'Only users with the ADMIN role can access this endpoint.',
  })
  @ApiGetAllUsersResponses()
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN)
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      message: 'Users retrieved successfully',
      data: users.map((user) => plainToClass(UserResponseDto, user)),
      count: users.length,
    };
  }

  @ApiOperation({
    summary: 'Retrieve user by ID',
    description: 'Only users with the ADMIN role can access this endpoint.',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiUserCrudResponses()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return {
      message: 'User retrieved successfully',
      data: plainToClass(UserResponseDto, user),
    };
  }

  @ApiOperation({
    summary: 'Update user information',
    description:
      'Requires role: ADMIN or USER. The USER can only update their own information.',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateUserDto })
  @ApiUpdateUserResponses()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
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

  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Only users with the ADMIN role can access this endpoint.',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiUserCrudResponses()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return {
      message: 'User removed successfully',
      data: null,
    };
  }
}
