import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Facility } from 'src/core/facilities/schemas/facility.schema';

export type CourtDocument = HydratedDocument<Court>;

@Schema({ timestamps: true })
export class Court {
  @Prop({ type: mongoose.Schema.ObjectId, ref: Facility.name })
  facilityId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  pricePerHour: number;

  @Prop({ default:false })
  status: boolean;
}

export const CourtSchema = SchemaFactory.createForClass(Court);
