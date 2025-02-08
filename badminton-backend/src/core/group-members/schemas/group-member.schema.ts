import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/core/users/schemas/user.schema';
import { Group } from 'src/core/groups/schemas/group.schema';
import { GROUP_ROLE } from 'src/config/type';

export type GroupMemberDocument = HydratedDocument<GroupMember>;

@Schema()
export class GroupMember {
  @Prop({ type: mongoose.Schema.ObjectId, ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: Group.name })
  GroupId: mongoose.Schema.Types.ObjectId;

  @Prop({ enum: GROUP_ROLE, default: GROUP_ROLE.MEMBER })
  role: GROUP_ROLE;
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);
