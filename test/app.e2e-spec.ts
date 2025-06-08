/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { UserType } from '../src/common/enums/user-type.enum';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { AuthResult } from 'src/auth/auth.service';
import * as cookieParser from 'cookie-parser';

interface UserApiResponse {
  message: string;
  data: UserResponseDto;
}

interface UsersApiResponse {
  message: string;
  data: UserResponseDto[];
  count: number;
}

interface MessageResponse {
  message: string;
}

function extractRefreshTokenCookie(
  headers: Record<string, string | string[]>,
): string | undefined {
  const setCookieHeader = headers['set-cookie'];

  if (!setCookieHeader) {
    return undefined;
  }

  const cookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  const refreshCookie = cookies.find((cookie: string) =>
    cookie.startsWith('refreshToken='),
  );

  // Return just the token value, not the full cookie string
  return refreshCookie?.split('=')[1]?.split(';')[0];
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: Repository<User>;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Add cookie parser middleware
    app.use(cookieParser());

    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.synchronize(true);

    userRepository = dataSource.getRepository(User);

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userRepository.save({
      name: 'System Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserType.ADMIN,
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });

    const body = res.body as AuthResult;
    adminToken = body.accessToken;
  });

  afterAll(async () => {
    await dataSource.synchronize(true);
    await app.close();
  });

  it('/auth/login (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' })
      .expect(200);

    const body = res.body as AuthResult;
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('email', 'admin@example.com');
  });

  it('/auth/me (GET) - success', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as { email: string; role: UserType };
    expect(body).toHaveProperty('email', 'admin@example.com');
    expect(body).toHaveProperty('role', UserType.ADMIN);
  });

  it('/users (GET) - admin access', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as UsersApiResponse;
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.count).toBe('number');
  });

  it('/users (POST) - create user as admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: UserType.USER,
      })
      .expect(201);

    const body = res.body as UserApiResponse;
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('email', 'testuser@example.com');
  });

  it('/users (POST) - fail with duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Another User',
        email: 'testuser@example.com',
        password: 'password123',
        role: UserType.USER,
      })
      .expect(409);
  });

  it('/users (POST) - fail without admin token', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'No Auth User',
        email: 'noauth@example.com',
        password: 'password123',
        role: UserType.USER,
      })
      .expect(401);
  });

  it('/users/:id (GET) - get user by id as admin', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('email', 'admin@example.com');
  });

  it('/users/:id (GET) - not found', async () => {
    await request(app.getHttpServer())
      .get('/users/9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('/users/:id (PATCH) - update user as admin', async () => {
    const res = await request(app.getHttpServer())
      .patch('/users/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Admin' })
      .expect(200);

    const body = res.body as UserApiResponse;
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('name', 'Updated Admin');
  });

  it('/users/:id (DELETE) - delete user as admin', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Delete Me',
        email: 'deleteme@example.com',
        password: 'password123',
        role: UserType.USER,
      })
      .expect(201);

    const body = createRes.body as UserApiResponse;
    const userId = body.data.id;

    const res = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const messageBody = res.body as MessageResponse;
    expect(messageBody).toHaveProperty('message', 'User removed successfully');
  });

  it('/users/:id (DELETE) - not found', async () => {
    await request(app.getHttpServer())
      .delete('/users/9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('/users (GET) - forbidden for non-admin', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Regular User',
        email: 'regular@example.com',
        password: 'password123',
        role: UserType.USER,
      })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'regular@example.com', password: 'password123' })
      .expect(200);

    const body = loginRes.body as AuthResult;
    const userToken = body.accessToken;

    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('/auth/me (GET) - fail with no token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('/auth/me (GET) - fail with invalid token', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid.token.here')
      .expect(401);
  });

  describe('/auth/refresh (POST)', () => {
    it('should refresh token successfully with valid refresh token cookie', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'admin123' })
        .expect(200);

      const loginBody = loginRes.body as AuthResult;
      const refreshTokenCookie = extractRefreshTokenCookie(loginRes.headers);

      expect(refreshTokenCookie).toBeDefined();

      if (!refreshTokenCookie) {
        throw new Error('refreshTokenCookie is undefined');
      }

      const refreshRes = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', `refreshToken=${refreshTokenCookie}`)
        .expect(200);

      const refreshBody = refreshRes.body as { accessToken: string };
      expect(refreshBody).toHaveProperty('accessToken');
      expect(typeof refreshBody.accessToken).toBe('string');
      expect(refreshBody.accessToken).not.toBe(loginBody.accessToken);

      const newRefreshCookie = extractRefreshTokenCookie(refreshRes.headers);
      expect(newRefreshCookie).toBeDefined();
    });

    it('should fail with no refresh token cookie', async () => {
      await request(app.getHttpServer()).post('/auth/refresh').expect(401);
    });

    it('should fail with invalid refresh token cookie', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', 'refreshToken=invalid.token.here')
        .expect(401);
    });

    it('should fail with malformed refresh token cookie', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', 'refreshToken=malformed-token')
        .expect(401);
    });

    it('should work with new access token from refresh', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'admin123' })
        .expect(200);

      const refreshTokenCookie = extractRefreshTokenCookie(loginRes.headers);

      if (!refreshTokenCookie) {
        throw new Error('refreshTokenCookie is undefined');
      }

      const refreshRes = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', `refreshToken=${refreshTokenCookie}`)
        .expect(200);

      const refreshBody = refreshRes.body as { accessToken: string };

      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${refreshBody.accessToken}`)
        .expect(200);
    });

    it('should fail when refresh token is used after user deletion', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Temp User',
          email: 'temp@example.com',
          password: 'password123',
          role: UserType.USER,
        })
        .expect(201);

      const tempUser = createRes.body as UserApiResponse;

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'temp@example.com', password: 'password123' })
        .expect(200);

      const refreshTokenCookie = extractRefreshTokenCookie(loginRes.headers);

      await request(app.getHttpServer())
        .delete(`/users/${tempUser.data.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      if (!refreshTokenCookie) {
        throw new Error('refreshTokenCookie is undefined');
      }

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', `refreshToken=${refreshTokenCookie}`)
        .expect(401);
    });
  });
});
