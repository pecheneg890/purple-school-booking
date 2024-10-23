import { IsNumber, Min, IsString, IsEnum, IsBoolean, IsNotEmpty } from 'class-validator';
import { RoomType } from '../schemas/room.schema';

export class RoomUpdateDto {
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
