import { IsBoolean, IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { RoomType } from '../schemas/room.schema';

export class RoomCreateDto {
	@IsNumber()
	@Min(1)
	number: number;

	@IsString()
	description: string;

	@IsEnum(RoomType)
	type: RoomType;

	@IsBoolean()
	seaView: boolean;
}
