import { RoomType } from '../schemas/room.schema';

export class RoomCreateDto {
	number: number;
	description: string;
	type: RoomType;
	seaView: boolean;
}
