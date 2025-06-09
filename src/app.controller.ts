import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { UsersService } from './users/users.service';
import { UserResponseDto } from './users/dto/user-response.dto';
import { RegisterUserDto } from './auth/dto/register-user.dto';
import { RegisterResponseDto } from './auth/dto/register-response.dto';
import { ApiRegisterOperation } from './common/decorators/api-auth-responses.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @ApiRegisterOperation()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    const user = await this.usersService.create(registerUserDto);
    return {
      message: 'User registered successfully',
      data: plainToClass(UserResponseDto, user),
    };
  }
}
