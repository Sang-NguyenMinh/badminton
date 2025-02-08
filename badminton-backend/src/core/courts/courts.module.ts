import { Module } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Court, CourtSchema } from './schemas/court.schema';
import { ReservationDetailsModule } from '../reservation-details/reservation-details.module';
import { ReservationDetailsService } from '../reservation-details/reservation-details.service';
import {
  ReservationDetail,
  ReservationDetailSchema,
} from '../reservation-details/schemas/reservation-details.schema';
import {
  Facility,
  FacilitySchema,
} from '../facilities/schemas/facility.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Court.name, schema: CourtSchema },
      { name: ReservationDetail.name, schema: ReservationDetailSchema },
      { name: Facility.name, schema: FacilitySchema },
    ]),
  ],
  controllers: [CourtsController],
  providers: [CourtsService],
  exports: [CourtsService],
})
export class CourtsModule {}
