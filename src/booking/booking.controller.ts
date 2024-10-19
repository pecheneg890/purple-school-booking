import {
	Controller,
	Get,
	Post,
	Delete,
	Patch,
	Body,
	Param,
	Query,
	UsePipes,
	ValidationPipe,
	NotFoundException,
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
		if (!room) throw new NotFoundException(BOOKING_NOT_FOUND);
		return room;
	}

	@Post()
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: BookingCreateDto) {
		return await this.bookingService.create(dto);
	}

	@Get()
	async getAll(@Query('date') date?: Date) {
		return await this.bookingService.getAll(date);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedBooking = await this.bookingService.delete(id);
		if (!deletedBooking) throw new NotFoundException(BOOKING_NOT_FOUND);
		return deletedBooking;
	}

	@Patch(':id')
	@UsePipes(new ValidationPipe())
	async update(@Param('id') id: string, @Body() dto: BookingUpdateDto) {
		const room = await this.bookingService.update(id, dto);
		if (!room) throw new NotFoundException(BOOKING_NOT_FOUND);
		return room;
	}

	@Get('byRoom/:id')
	async getByRoom(@Param('id') id: string) {
		return await this.bookingService.getByRoom(id);
	}
}
