import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Roles {
	admin = 'admin',
	user = 'user',
}

@Schema()
export class User {
	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	name: string;

	@Prop()
	phone: number;

	@Prop({ required: true, enum: Roles })
	role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
