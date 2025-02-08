import { Module } from '@nestjs/common';
import { ReservationDetailsService } from './reservation-details.service';
import { ReservationDetailsController } from './reservation-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReservationDetail,
  ReservationDetailSchema,
} from './schemas/reservation-details.schema';
import {
  Reservation,
  ReservationSchema,
} from '../reservations/schemas/reservation.schema';
import { ReservationsModule } from '../reservations/reservations.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReservationDetail.name, schema: ReservationDetailSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  controllers: [ReservationDetailsController],
  providers: [ReservationDetailsService],
  exports: [ReservationDetailsService],
})
export class ReservationDetailsModule {}
