export class ReservationDetailDetail {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Court } from 'src/core/courts/schemas/court.schema';


export type ReservationDetailDocument = HydratedDocument<ReservationDetail>;

@Schema({ timestamps: true })
export class ReservationDetail {
  @Prop({ type: mongoose.Schema.ObjectId, ref: ReservationDetail.name })
  reservationID: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: Court.name })
  courtId: mongoose.Schema.Types.ObjectId;

  @Prop()
  reservationDate?: Date;
  
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

  @Prop()
  price:number
}

export const ReservationDetailSchema =
  SchemaFactory.createForClass(ReservationDetail);
