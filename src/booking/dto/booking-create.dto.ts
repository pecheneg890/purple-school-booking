import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class BookingCreateDto {
	@IsDate()
	@Type(() => Date)
	date: Date;
	@IsString()
	room: string;
	@IsString()
	person: string;
}
