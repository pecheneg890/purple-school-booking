import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum RoomType {
	single,
	double,
	suite,
	twin,
}

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
	@Prop({ required: true, unique: true })
	number: number;
	@Prop()
	description: string;
	@Prop({ required: true, enum: RoomType })
	type: RoomType;
	@Prop()
	seaView: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
