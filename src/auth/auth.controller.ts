import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { AUTH_CONFIG } from './config/auth.config';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RequestWithUser } from './types/auth.types';
import {
  ApiLoginOperation,
  ApiMeOperation,
  ApiRefreshTokenOperation,
} from '../common/decorators/api-auth-responses.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiLoginOperation()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() input: { email: string; password: string },
    @Res() res: ExpressResponse,
  ) {
    const result = await this.authService.authenticate(input);

    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.cookie(
      'refreshToken',
      result.refreshToken,
      AUTH_CONFIG.REFRESH_COOKIE_OPTIONS,
    );

    return res.json({
      accessToken: result.accessToken,
      userId: result.userId,
      email: result.email,
    });
  }

  @ApiMeOperation()
  @Get('me')
  @UseGuards(AuthGuard)
  getUserInfo(@Req() request: RequestWithUser) {
    return request.user;
  }

  @ApiRefreshTokenOperation()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    const cookies = req.cookies as Record<string, string> | undefined;
    const refreshToken = cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
      const result = await this.authService.refresh(refreshToken);

      res.cookie(
        'refreshToken',
        result.refreshToken,
        AUTH_CONFIG.REFRESH_COOKIE_OPTIONS,
      );

      return res.json({ accessToken: result.accessToken });
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }
}
