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
import { Role } from '../decorators/role.decorator';
import { Roles } from '../user/schemas/user.schema';
import { userEmail } from '../decorators/user-email.decorator';

@Controller('booking')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get('statByPeriod/:year/:month')
	@Role(Roles.admin)
	async getStatByPeriod(@Param('year') year: number, @Param('month') month: number) {
		return this.bookingService.getStatByPeriod(year, month);
	}

	@Get(':id')
	@Role(Roles.user)
	async get(@Param('id') id: string) {
		const room = await this.bookingService.get(id);
		if (!room) throw new NotFoundException(BOOKING_NOT_FOUND);
		return room;
	}

	@Post()
	@Role(Roles.user)
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: BookingCreateDto, @userEmail() email: string) {
		return await this.bookingService.create(dto, email);
	}

	@Get()
	@Role(Roles.admin)
	async getAll(@Query('date') date?: Date) {
		return await this.bookingService.getAll(date);
	}

	@Delete(':id')
	@Role(Roles.user)
	async delete(@Param('id') id: string) {
		const deletedBooking = await this.bookingService.delete(id);
		if (!deletedBooking) throw new NotFoundException(BOOKING_NOT_FOUND);
		return deletedBooking;
	}

	@Patch(':id')
	@UsePipes(new ValidationPipe())
	@Role(Roles.admin)
	async update(@Param('id') id: string, @Body() dto: BookingUpdateDto) {
		const room = await this.bookingService.update(id, dto);
		if (!room) throw new NotFoundException(BOOKING_NOT_FOUND);
		return room;
	}

	@Get('byRoom/:id')
	@Role(Roles.admin)
	async getByRoom(@Param('id') id: string) {
		return await this.bookingService.getByRoom(id);
	}
}
