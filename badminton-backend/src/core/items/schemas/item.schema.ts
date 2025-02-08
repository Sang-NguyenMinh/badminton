import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ITEM_STATUS } from 'src/config/type';
import { Facility } from 'src/core/facilities/schemas/facility.schema';

export type ItemDocument = HydratedDocument<Item>;

@Schema({ timestamps: true })
export class Item {
  @Prop({ type: mongoose.Schema.ObjectId, ref: Facility.name })
  facilityId: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  amount: number;

  @Prop({ default: ITEM_STATUS.AVAILABLE })
  status: ITEM_STATUS;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
