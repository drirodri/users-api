import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RequestWithUser } from './types/auth.types';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiLoginOperation,
  ApiMeOperation,
} from '../common/decorators/api-auth-responses.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiLoginOperation()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input: { email: string; password: string }) {
    return this.authService.authenticate(input);
  }

  @ApiMeOperation()
  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() request: RequestWithUser) {
    return request.user;
  }
}
