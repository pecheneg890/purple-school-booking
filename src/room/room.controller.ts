import {
	Controller,
	Param,
	Get,
	Post,
	Body,
	Delete,
	Patch,
	ValidationPipe,
	UsePipes,
	NotFoundException,
} from '@nestjs/common';
import { RoomCreateDto } from './dto/room-create.dto';
import { RoomService } from './room.service';
import { RoomUpdateDto } from './dto/room-update.dto';
import { ROOM_NOT_FOUND } from './room.constants';
import { Role } from '../decorators/role.decorator';
import { Roles } from '../user/schemas/user.schema';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Get(':id')
	@Role(Roles.user)
	async get(@Param('id') id: string) {
		const room = await this.roomService.get(id);
		if (!room) throw new NotFoundException(ROOM_NOT_FOUND);
		return room;
	}

	@Post()
	@Role(Roles.admin)
	@UsePipes(new ValidationPipe())
	async create(@Body() dto: RoomCreateDto) {
		return await this.roomService.create(dto);
	}

	@Get()
	@Role(Roles.user)
	async getAll() {
		return await this.roomService.getAll();
	}

	@Delete(':id')
	@Role(Roles.admin)
	async delete(@Param('id') id: string) {
		const deletedRoom = await this.roomService.delete(id);
		if (!deletedRoom) throw new NotFoundException(ROOM_NOT_FOUND);
		return deletedRoom;
	}

	@Patch(':id')
	@Role(Roles.admin)
	@UsePipes(new ValidationPipe())
	async update(@Param('id') id: string, @Body() dto: RoomUpdateDto) {
		const room = await this.roomService.update(id, dto);
		if (!room) throw new NotFoundException(ROOM_NOT_FOUND);
		return room;
	}
}
