import {
	Controller,
	Get,
	Post,
	Delete,
	Patch,
	Body,
	Param,
	HttpException,
	HttpStatus,
	Query,
} from '@nestjs/common';
import { BOOKING_NOT_FOUND } from './booking.constants';
import { BookingCreateDto } from './dto/booking-create.dto';
import { BookingUpdateDto } from './dto/booking-update.dto';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get(':id')
	async get(@Param('id') id: string) {
		const room = await this.bookingService.get(id);
		if (!room) throw new HttpException(BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
		return room;
	}

	@Post()
	async create(@Body() dto: BookingCreateDto) {
		try {
			return await this.bookingService.create(dto);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.CONFLICT);
		}
	}

	@Get()
	async getAll(@Query('date') date?: Date) {
		return await this.bookingService.getAll(date);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedBooking = await this.bookingService.delete(id);
		if (!deletedBooking) throw new HttpException(BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
		return deletedBooking;
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: BookingUpdateDto) {
		try {
			const room = await this.bookingService.update(id, dto);
			if (!room) throw new HttpException(BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
			return room;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.CONFLICT);
		}
	}

	@Get('byRoom/:id')
	async getByRoom(@Param('id') id: string) {
		return await this.bookingService.getByRoom(id);
	}
}
