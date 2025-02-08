import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PAYMENT_METHOD, PAYMENT_STATUS } from 'src/config/type';
import { Facility } from 'src/core/facilities/schemas/facility.schema';
import { User } from 'src/core/users/schemas/user.schema';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: Facility.name })
  facility: mongoose.Schema.Types.ObjectId;

  @Prop({ default: PAYMENT_STATUS.PENDING })
  status?: PAYMENT_STATUS;

  @Prop()
  reservationDate?: Date;

  @Prop()
  totalAmount?: number;

  @Prop({ default: PAYMENT_METHOD.CASH })
  paymentMethod?: PAYMENT_METHOD;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
