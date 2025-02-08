import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/core/users/schemas/user.schema';
import { Group } from 'src/core/groups/schemas/group.schema';
import { POST_STATUS } from 'src/config/type';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  owner: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: Group.name })
  groupId: mongoose.Schema.Types.ObjectId;

  @Prop()
  content: string;

  @Prop()
  images: Array<string>;

  @Prop({ default: false })
  isLockComment: boolean;

  @Prop({ default: POST_STATUS.PUBLISHED })
  status: POST_STATUS;
}

export const PostSchema = SchemaFactory.createForClass(Post);
