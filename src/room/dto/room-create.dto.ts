import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { RoomType } from '../schemas/room.schema';

export class RoomCreateDto {
	@IsNumber()
	@Min(1)
	@IsNotEmpty()
	number: number;

	@IsString()
	description: string;

	@IsEnum(RoomType)
	@IsNotEmpty()
	type: RoomType;

	@IsBoolean()
	seaView: boolean;
}
