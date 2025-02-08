import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  participants: MongooseSchema.Types.ObjectId[];

  @Prop({ default: false })
  isGroup: boolean;

  @Prop()
  groupName?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  groupAdmin?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message' })
  lastMessage?: MongooseSchema.Types.ObjectId;

  @Prop()
  groupAvatar?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
