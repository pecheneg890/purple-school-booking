import {
	Controller,
	Param,
	Get,
	Post,
	Body,
	Delete,
	Patch,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { RoomCreateDto } from './dto/room-create.dto';
import { RoomService } from './room.service';
import { RoomUpdateDto } from './dto/room-update.dto';
import { ROOM_NOT_FOUND } from './room.constants';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Get(':id')
	async get(@Param('id') id: string) {
		const room = await this.roomService.get(id);
		if (!room) throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		return room;
	}

	@Post()
	async create(@Body() dto: RoomCreateDto) {
		return await this.roomService.create(dto);
	}

	@Get()
	async getAll() {
		return await this.roomService.getAll();
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedRoom = await this.roomService.delete(id);
		if (!deletedRoom) throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		return deletedRoom;
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: RoomUpdateDto) {
		const room = await this.roomService.update(id, dto);
		if (!room) throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		return room;
	}
}
