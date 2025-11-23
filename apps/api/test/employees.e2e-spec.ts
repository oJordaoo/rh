import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';

const loginAsAdmin = async (app: INestApplication) => {
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: 'admin@peopleos.com', password: 'admin123' })
    .expect(201);
  return response.body.accessToken as string;
};

describe('EmployeesModule (e2e)', () => {
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

  beforeEach(() => {
    database.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create, list, update and delete an employee with proper roles', async () => {
    const token = await loginAsAdmin(app);

    const createResponse = await request(app.getHttpServer())
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Carlos Dias', email: 'carlos@peopleos.com', position: 'Developer' })
      .expect(201);

    const createdId = createResponse.body.id;
    expect(createResponse.body.name).toBe('Carlos Dias');

    const listResponse = await request(app.getHttpServer())
      .get('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(listResponse.body.find((emp: any) => emp.id === createdId)).toBeTruthy();

    const updateResponse = await request(app.getHttpServer())
      .patch(`/api/employees/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ position: 'Senior Developer', department: 'Engineering' })
      .expect(200);
    expect(updateResponse.body.position).toBe('Senior Developer');
    expect(updateResponse.body.department).toBe('Engineering');

    await request(app.getHttpServer())
      .delete(`/api/employees/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/employees/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
