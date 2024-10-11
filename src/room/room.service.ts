import { Injectable } from '@nestjs/common';
import { Room, RoomDocument } from './schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomCreateDto } from './dto/room-create.dto';
import { RoomUpdateDto } from './dto/room-update.dto';

@Injectable()
export class RoomService {
	constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

	async create(dto: RoomCreateDto): Promise<RoomDocument> {
		return this.roomModel.create(dto);
	}

	async get(id: string): Promise<RoomDocument | null> {
		return this.roomModel.findById(id).exec();
	}

	async getAll(): Promise<RoomDocument[]> {
		return this.roomModel.find().exec();
	}

	async update(id: string, dto: RoomUpdateDto): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async delete(id: string): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndDelete(id).exec();
	}
}
