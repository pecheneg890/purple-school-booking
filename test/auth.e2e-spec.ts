import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { UserCreateDto } from 'src/user/dto/user-create.dto';
import { Roles } from '../src/user/schemas/user.schema';
import { LoginDto } from 'src/auth/dto/login.dto';

const userAdmin: UserCreateDto = {
	email: 'testAdmin@gmail.com',
	name: 'testAdmin',
	password: '123',
	phone: 444,
	role: Roles.admin,
};
const userUser: UserCreateDto = {
	email: 'testUser@gmail.com',
	name: 'testUser',
	password: '123',
	phone: 444,
	role: Roles.user,
};

const loginAdmin: LoginDto = {
	email: userAdmin.email,
	password: userAdmin.password,
};

const loginUser: LoginDto = {
	email: userUser.email,
	password: userUser.password,
};
let jwtUser = '';
let jwtAdmin = '';

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/register (POST) регистрация пользователя с ролью admin', async () => {
		return await request(app.getHttpServer()).post('/auth/register').send(userAdmin).expect(201);
	});

	it('/auth/register (POST) регистрация пользователя с ролью user', async () => {
		return await request(app.getHttpServer()).post('/auth/register').send(userUser).expect(201);
	});

	it('/auth/login (POST) логин пользователя с ролью admin', async () => {
		return await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginAdmin)
			.expect(201)
			.then(({ body }: request.Response) => {
				jwtAdmin = body.access_token;
				expect(jwtAdmin).toBeDefined();
			});
	});

	it('/auth/login (POST) логин с неверным пользователем', async () => {
		return await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginUser, email: 'fds@gmail.com' })
			.expect(401, {
				message: 'Пользователь не найден',
				error: 'Unauthorized',
				statusCode: 401,
			});
	});

	it('/auth/login (POST) логин с неверным паролем', async () => {
		return await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginUser, password: '4444' })
			.expect(401, {
				message: 'Неверный пароль',
				error: 'Unauthorized',
				statusCode: 401,
			});
	});

	it('/auth/login (POST) логин пользователя с ролью user', async () => {
		return await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginUser)
			.expect(201)
			.then(({ body }: request.Response) => {
				jwtUser = body.access_token;
				expect(jwtUser).toBeDefined();
			});
	});

	it('/booking/byRoom/id (GET) - проверка что сервис недоступен обычному пользователю', async () => {
		return await request(app.getHttpServer())
			.get('/booking/byRoom/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + jwtUser)
			.expect(403);
	});
	it('/booking/byRoom/id (GET) - проверка что сервис доступен пользователю admin', async () => {
		return await request(app.getHttpServer())
			.get('/booking/byRoom/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + jwtAdmin)
			.expect(200);
	});

	it('/user (POST) удаление пользователя с ролью user', async () => {
		return await request(app.getHttpServer())
			.delete('/user/' + userUser.email)
			.set('Authorization', 'Bearer ' + jwtAdmin)
			.expect(200);
	});

	it('/user (POST) удаление пользователя с ролью admin', async () => {
		return await request(app.getHttpServer())
			.delete('/user/' + userAdmin.email)
			.set('Authorization', 'Bearer ' + jwtAdmin)
			.expect(200);
	});

	afterAll(async () => {
		disconnect();
	});
});
