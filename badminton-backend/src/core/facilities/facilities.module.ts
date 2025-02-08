import { Module } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility, FacilitySchema } from './schemas/facility.schema';
import { Court, CourtSchema } from '../courts/schemas/court.schema';
import { CourtsService } from '../courts/courts.service';
import { CourtsController } from '../courts/courts.controller';
import { CourtsModule } from '../courts/courts.module';

@Module({
  imports: [CourtsModule,
    MongooseModule.forFeature([
      { name: Facility.name, schema: FacilitySchema },
    ]),
  ],
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
  exports: [FacilitiesService],
})
export class FacilitiesModule {}
