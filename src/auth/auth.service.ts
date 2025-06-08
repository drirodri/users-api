import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/common/enums/user-type.enum';
import { AUTH_CONFIG } from './config/auth.config';

type AuthInput = {
  email: string;
  password: string;
};
type SignInData = {
  userId: number;
  email: string;
  role: UserType;
};
type PayloadData = {
  sub: number;
  email: string;
  role: UserType;
};
export type AuthResult = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult | null> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.userService.findByEmail(input.email);
    if (user && (await bcrypt.compare(input.password, user.password))) {
      return {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    }
    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload: PayloadData = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.saveRefreshToken(user.userId, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
      userId: user.userId,
      email: user.email,
    };
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    try {
      const payload: PayloadData = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      );

      const user = await this.userService.findOne(payload.sub);

      if (!user.refreshToken) {
        throw new UnauthorizedException('No refresh token stored');
      }
      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token does not match');
      }

      const signInData: SignInData = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      return this.signIn(signInData);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
