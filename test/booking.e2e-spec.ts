import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { BookingCreateDto } from 'src/booking/dto/booking-create.dto';
import { BookingUpdateDto } from 'src/booking/dto/booking-update.dto';

const booking: BookingCreateDto = {
	date: new Date(),
	room: new Types.ObjectId().toHexString(),
	person: 'Ivanov',
};
const bookingUpdate: BookingUpdateDto = {
	date: new Date(),
	room: new Types.ObjectId().toHexString(),
	person: 'Petrov',
};

let createdId: string;
let bookingCount = 0;
let bookingByRoomCount = 0;

describe('BookingController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/booking (GET) получение списка бронирований, фиксируем количество и проверяем что приходит массив', async () => {
		return await request(app.getHttpServer())
			.get('/booking')
			.expect(200)
			.then(({ body }: request.Response) => {
				bookingCount = body.length;
				expect(Array.isArray(body)).toBeTruthy();
			});
	});

	it('/booking (POST) - создаем бронирование, проверяем что вернулся id', async () => {
		return await request(app.getHttpServer())
			.post('/booking/')
			.send(booking)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/booking/byRoom/id (GET) - получение списка бронирований по комнате, фиксируем количество и проверяем что приходит массив', async () => {
		return await request(app.getHttpServer())
			.get('/booking/byRoom/' + bookingUpdate.room)
			.expect(200)
			.then(({ body }: request.Response) => {
				bookingByRoomCount = body.length;
				expect(Array.isArray(body)).toBeTruthy();
			});
	});

	it('/booking/id (PATCH) - обновление бронирования', async () => {
		return await request(app.getHttpServer())
			.patch('/booking/' + createdId)
			.send(bookingUpdate)
			.expect(200);
	});

	it('/booking/id (GET) - получения бронирования по id, проверяем что содержит обновленные данные', async () => {
		return await request(app.getHttpServer())
			.get('/booking/' + createdId)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(new Date(body.date)).toEqual(bookingUpdate.date);
				expect(body.room).toEqual(bookingUpdate.room);
				expect(body.person).toEqual(bookingUpdate.person);
			});
	});

	it('/booking (GET) - проверяем что список бронирований увеличился на 1', async () => {
		return await request(app.getHttpServer())
			.get('/booking')
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body).toHaveLength(bookingCount + 1);
			});
	});

	it('/booking/byRoom/id (GET) - проверяем что список бронирований по комнате увеличился на 1', async () => {
		return await request(app.getHttpServer())
			.get('/booking/byRoom/' + bookingUpdate.room)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body).toHaveLength(bookingByRoomCount + 1);
			});
	});

	it('/booking/id (POST) - попытка сделать еще одно бронирование по той же комнате в ту же дату', async () => {
		return await request(app.getHttpServer())
			.patch('/booking/' + new Types.ObjectId().toHexString())
			.send({ ...bookingUpdate, person: 'Smirnov' })
			.expect(409);
	});

	it('/booking/id (DELETE) - удаление бронирования', async () => {
		return await request(app.getHttpServer())
			.delete('/booking/' + createdId)
			.expect(200);
	});

	it('/booking/id (PATCH) - обновление несуществующего бронирования', async () => {
		return await request(app.getHttpServer())
			.patch('/booking/' + new Types.ObjectId().toHexString())
			.send(bookingUpdate)
			.expect(404);
	});

	it('/booking/id (DELETE) - удаление несуществующего бронирования', async () => {
		return await request(app.getHttpServer())
			.delete('/booking/' + new Types.ObjectId().toHexString())
			.expect(404);
	});

	it('/booking/id (GET) - чтение несуществующего бронирования', async () => {
		return await request(app.getHttpServer())
			.get('/booking/' + new Types.ObjectId().toHexString())
			.expect(404);
	});

	it('/booking (POST) - создание бронирования с неверными параметрами', async () => {
		return await request(app.getHttpServer())
			.post('/booking/')
			.send({ ...booking, person: 444 })
			.expect(400);
	});

	afterAll(async () => {
		disconnect();
	});
});
