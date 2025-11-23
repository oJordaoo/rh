import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let database: DatabaseService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    database = app.get(DatabaseService);
  });

  beforeEach(async () => {
    database.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login seed admin and return tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@peopleos.com', password: 'admin123' })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body.user.email).toBe('admin@peopleos.com');
    expect(response.body.user.roles).toContain('ADMIN');
  });

  it('should refresh tokens using refresh token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@peopleos.com', password: 'admin123' })
      .expect(201);

    const refreshResponse = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: loginResponse.body.refreshToken })
      .expect(201);

    expect(refreshResponse.body.accessToken).toBeDefined();
    expect(refreshResponse.body.refreshToken).toBeDefined();
    expect(refreshResponse.body.user.email).toBe('admin@peopleos.com');
  });

  it('should return authenticated user with /me', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@peopleos.com', password: 'admin123' })
      .expect(201);

    const meResponse = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(200);

    expect(meResponse.body.email).toBe('admin@peopleos.com');
    expect(meResponse.body.roles).toContain('ADMIN');
  });
});
