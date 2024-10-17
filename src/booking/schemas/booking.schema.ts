import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from '../../room/schemas/room.schema';

export type BookingDocument = HydratedDocument<Booking>;

@Schema()
export class Booking {
	@Prop({ required: true })
	date: Date;
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
	room: Room;
	@Prop()
	person: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
