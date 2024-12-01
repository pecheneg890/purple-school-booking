import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from 'src/room/room.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
		TelegramModule,
		UserModule,
		RoomModule,
	],
	controllers: [BookingController],
	providers: [BookingService],
})
export class BookingModule {}
