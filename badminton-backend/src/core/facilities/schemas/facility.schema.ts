import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { WEEKDAY } from 'src/config/type';
import { User } from 'src/core/users/schemas/user.schema';

export type FacilityDocument = HydratedDocument<Facility>;

@Schema({ timestamps: true })
export class Facility {
  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  ownerId: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop({ type: [String] })
  hotline?: string[];

  @Prop({default:'https://res.cloudinary.com/dzcj0i6fy/image/upload/v1728574637/facility-logo_rxulbl.png'})
  avatar?: string

  @Prop({
    required: true,
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  })
  startTime: string;

  @Prop({
    required: true,
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  })
  endTime: string; 

  @Prop({ type: [String], enum: WEEKDAY, default: [] })
  workingDays: WEEKDAY[];
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);

export interface TimeSlot {
  time: string;
  isBooked: boolean;
}

export interface CourtAvailability {
  id: string;
  name: string;
  pricePerHour: number;
  timeSlots: TimeSlot[];
}
