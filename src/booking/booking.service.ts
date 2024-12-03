import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BookingCreateDto } from './dto/booking-create.dto';
import { BookingUpdateDto } from './dto/booking-update.dto';
import { ALREADY_BOOKED, BOOKING_ERROR } from './booking.constants';
import { TelegramService } from 'src/telegram/telegram.service';
import { UserService } from 'src/user/user.service';
import { USER_NOT_FOUND } from 'src/user/user.constants';
import { RoomService } from 'src/room/room.service';
import { ROOM_NOT_FOUND } from 'src/room/room.constants';
import { format } from 'date-fns';

@Injectable()
export class BookingService {
	constructor(
		@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
		private readonly telegramService: TelegramService,
		private readonly userService: UserService,
		private readonly roomService: RoomService,
	) {}

	async create(dto: BookingCreateDto, email): Promise<BookingDocument> {
		const alwaysBooked = await this.bookingModel.findOne({ room: dto.room, date: dto.date });
		if (alwaysBooked) throw new ConflictException(ALREADY_BOOKED);

		const user = await this.userService.findUser(email);
		if (!user) throw new NotFoundException(USER_NOT_FOUND);

		const room = await this.roomService.get(dto.room);
		if (!room) throw new NotFoundException(ROOM_NOT_FOUND);

		const booking = await this.bookingModel.create({ ...dto, person: email });

		const message =
			`Комната ${room.number} забронирована на ${format(dto.date, 'dd.MM.yyyy')}` +
			`\nпользователем ${user.name}, телефон ${user.phone}`;
		await this.telegramService.sendMessage(message);

		return booking;
	}

	async get(id: string): Promise<BookingDocument | null> {
		return this.bookingModel.findById(id).exec();
	}

	async getAll(date?: Date): Promise<BookingDocument[]> {
		const filter: RootFilterQuery<Booking> = {};
		//фильтр по дате, если присутствует
		if (date) {
			filter.date = date;
		}
		return this.bookingModel.find(filter).exec();
	}

	async update(id: string, dto: BookingUpdateDto): Promise<BookingDocument | null> {
		//проверка что комната уже забронирована на эту дату
		const alwaysBooked = await this.bookingModel.findOne({ room: dto.room, date: dto.date });
		if (alwaysBooked) throw new ConflictException(ALREADY_BOOKED);

		return this.bookingModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async delete(id: string): Promise<BookingDocument | null> {
		return this.bookingModel.findByIdAndDelete(id).exec();
	}

	async getByRoom(id: string): Promise<BookingDocument[]> {
		return this.bookingModel.find({ room: id }).exec();
	}

	async getStatByPeriod(year: number, month: number) {
		const dateFrom = new Date(Date.UTC(year, month - 1, 1));
		const dateTo = new Date(Date.UTC(year, month, 0));

		return this.bookingModel
			.aggregate([
				{
					//ограничение на месяц
					$match: {
						date: {
							$gte: dateFrom,
							$lte: dateTo,
						},
					},
				},
				{
					//группировка по id комнаты, количество бронирований
					$group: {
						_id: {
							_room_id: '$room',
						},
						count: { $count: {} },
					},
				},
				{
					//вытаскиваем объект комнаты
					$lookup: {
						from: 'rooms',
						localField: '_id._room_id',
						foreignField: '_id',
						as: 'room',
					},
				},
				{
					//преобразуем массив наденных комнат в объект
					$unwind: '$room',
				},
				{
					//убираем из выдачи _id
					$unset: '_id',
				},
				{
					//вместо объекта комнаты возвращаем ее номер
					$addFields: {
						room: '$room.number',
					},
				},
			])
			.exec();
	}
}
