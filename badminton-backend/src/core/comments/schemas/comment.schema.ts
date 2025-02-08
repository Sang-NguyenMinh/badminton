import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/core/users/schemas/user.schema';
import { Group } from 'src/core/groups/schemas/group.schema';
import { Post } from 'src/core/posts/schemas/post.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: Post.name })
  postId: mongoose.Schema.Types.ObjectId;

  @Prop()
  content: string;

  @Prop({ type: [String] })
  iamges?: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
