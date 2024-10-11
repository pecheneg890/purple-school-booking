import { RoomType } from '../schemas/room.schema';

export class RoomUpdateDto {
	number: number;
	description: string;
	type: RoomType;
	seaView: boolean;
}
