import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { RoomCreateDto } from 'src/room/dto/room-create.dto';
import { RoomUpdateDto } from 'src/room/dto/room-update.dto';
import { UserCreateDto } from 'src/user/dto/user-create.dto';
import { Roles } from '../src/user/schemas/user.schema';
import { LoginDto } from 'src/auth/dto/login.dto';

const room: RoomCreateDto = {
	number: 42,
	description: 'decription',
	type: 0,
	seaView: true,
};
const roomUpdate: RoomUpdateDto = {
	number: 43,
	description: 'decription1',
	type: 1,
	seaView: false,
};
const user: UserCreateDto = {
	email: 'test1@gmail.com',
	name: 'TestUser',
	password: '123',
	phone: 444,
	role: Roles.admin,
};
const login: LoginDto = {
	email: user.email,
	password: user.password,
};

let createdId: string;
let roomCount = 0;
let jwt = '';

describe('RoomController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		//регистрация пользователя
		await request(app.getHttpServer()).post('/auth/register').send(user);

		//Логин пользователя и получение jwt токена
		await request(app.getHttpServer())
			.post('/auth/login')
			.send(login)
			.then(({ body }: request.Response) => {
				jwt = body.access_token;
			});
	});

	it('/room (GET) получение списка комнат, фиксируем количество и проверяем что приходит массив', async () => {
		return await request(app.getHttpServer())
			.get('/room')
			.set('Authorization', 'Bearer ' + jwt)
			.expect(200)
			.then(({ body }: request.Response) => {
				roomCount = body.length;
				expect(Array.isArray(body)).toBeTruthy();
			});
	});

	it('/room (POST) - создаем комнату, проверяем что вернулся id', async () => {
		return await request(app.getHttpServer())
			.post('/room/')
			.send(room)
			.set('Authorization', 'Bearer ' + jwt)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/room/id (PATCH) - обновление комнаты', async () => {
		return await request(app.getHttpServer())
			.patch('/room/' + createdId)
			.send(roomUpdate)
			.set('Authorization', 'Bearer ' + jwt)
			.expect(200);
	});

	it('/room/id (GET) - получение комнаты по id, проверяем что содержит обновленные данные', async () => {
		return await request(app.getHttpServer())
			.get('/room/' + createdId)
			.expect(200)
			.set('Authorization', 'Bearer ' + jwt)
			.then(({ body }: request.Response) => {
				for (const prop in roomUpdate) {
					expect(body[prop]).toEqual(roomUpdate[prop]);
				}
			});
	});

	it('/room/ (GET) - проверяем, что список комнат увеличился на 1', async () => {
		return await request(app.getHttpServer())
			.get('/room')
			.expect(200)
			.set('Authorization', 'Bearer ' + jwt)
			.then(({ body }: request.Response) => {
				expect(body).toHaveLength(roomCount + 1);
			});
	});

	it('/room/id (DELETE) - удаление комнаты', async () => {
		return await request(app.getHttpServer())
			.delete('/room/' + createdId)
			.set('Authorization', 'Bearer ' + jwt)
			.expect(200);
	});

	it('/room/id (PATCH) - обновление несуществующей комнаты', async () => {
		return await request(app.getHttpServer())
			.patch('/room/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + jwt)
			.send(roomUpdate)
			.expect(404);
	});

	it('/room/id (DELETE) - удаление несуществующей комнаты', async () => {
		return await request(app.getHttpServer())
			.delete('/room/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + jwt)
			.expect(404);
	});

	it('/room/id (GET) - чтение несуществующей комнаты', async () => {
		return await request(app.getHttpServer())
			.get('/room/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + jwt)
			.expect(404);
	});

	it('/room (POST) - создание комнаты с неверными параметрами', async () => {
		return await request(app.getHttpServer())
			.post('/room/')
			.set('Authorization', 'Bearer ' + jwt)
			.send({ ...room, type: 99 })
			.expect(400);
	});

	afterEach(async () => {
		//удаление созданного пользователя
		await request(app.getHttpServer())
			.delete('/user/' + user.email)
			.set('Authorization', 'Bearer ' + jwt);
	});

	afterAll(async () => {
		disconnect();
	});
});
