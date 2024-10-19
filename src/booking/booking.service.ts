import { ConflictException, Injectable } from '@nestjs/common';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BookingCreateDto } from './dto/booking-create.dto';
import { BookingUpdateDto } from './dto/booking-update.dto';
import { ALREADY_BOOKED } from './booking.constants';

@Injectable()
export class BookingService {
	constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

	async create(dto: BookingCreateDto): Promise<BookingDocument> {
		//проверка что комната уже забронирована на эту дату
		const alwaysBooked = await this.bookingModel.findOne({ room: dto.room, date: dto.date });
		if (alwaysBooked) throw new ConflictException(ALREADY_BOOKED);

		return this.bookingModel.create(dto);
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
}
