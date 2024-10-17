import { IsNumber, Min, IsString, IsEnum, IsBoolean } from 'class-validator';
import { RoomType } from '../schemas/room.schema';

export class RoomUpdateDto {
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
