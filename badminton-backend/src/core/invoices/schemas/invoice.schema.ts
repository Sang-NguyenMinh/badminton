import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PAYMENT_METHOD, PAYMENT_STATUS } from 'src/config/type';
import {
  Reservation,
  ReservationSchema,
} from 'src/core/reservations/schemas/reservation.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: mongoose.Schema.ObjectId, ref: Reservation.name })
  reservationId: mongoose.Schema.Types.ObjectId;

  @Prop()
  invoiceDate: Date;

  @Prop({ default: PAYMENT_STATUS.PENDING })
  status: PAYMENT_STATUS;

  @Prop({ default: PAYMENT_METHOD.CASH })
  paymentMethod: PAYMENT_METHOD;

  @Prop()
  totalAmount: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
