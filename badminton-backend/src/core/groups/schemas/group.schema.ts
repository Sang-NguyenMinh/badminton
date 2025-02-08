import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GROUP_STATUS } from 'src/config/type';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ timestamps: true })
export class Group {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ default: GROUP_STATUS.ACTIVE })
  status: GROUP_STATUS;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
