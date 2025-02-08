import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/core/users/schemas/user.schema';
import { Post } from 'src/core/posts/schemas/post.schema';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema({ timestamps: true })
export class Reaction {
  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: Post.name })
  postId: mongoose.Schema.Types.ObjectId;

  @Prop()
  type: string;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
