import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';

@Module({
	imports: [RoomModule, BookingModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
