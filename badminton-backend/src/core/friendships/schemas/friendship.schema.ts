import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { FRIENDSHIP_STATUS } from 'src/config/type';
import { User } from 'src/core/users/schemas/user.schema';

export type FriendshipDocument = HydratedDocument<Friendship>;

@Schema({ timestamps: true })
export class Friendship {
  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  userId1: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  userId2: mongoose.Schema.Types.ObjectId;

  @Prop({ enum: FRIENDSHIP_STATUS, default: FRIENDSHIP_STATUS.PENDING })
  status: FRIENDSHIP_STATUS;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
