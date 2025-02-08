import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Invoice } from 'src/core/invoices/schemas/invoice.schema';
import { Item } from 'src/core/items/schemas/item.schema';

export type InvoiceDetailDocument = HydratedDocument<InvoiceDetail>;

@Schema({ timestamps: true })
export class InvoiceDetail {
  @Prop({ type: mongoose.Schema.ObjectId, ref: Invoice.name })
  invoiceId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: Item.name })
  itemId: mongoose.Schema.Types.ObjectId;

  @Prop()
  quantity: number;

  @Prop()
  currentPrice: number;
}

export const InvoiceDetailSchema = SchemaFactory.createForClass(InvoiceDetail);
