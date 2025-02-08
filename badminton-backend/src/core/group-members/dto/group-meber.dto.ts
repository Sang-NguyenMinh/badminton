import { IsMongoId, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { GROUP_ROLE } from 'src/config/type';

export class CreateGroupMemberDto {
  @IsMongoId({ message: 'Invalid userId' })
  @IsNotEmpty({ message: 'userId cannot be empty' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'Invalid groupId' })
  @IsNotEmpty({ message: 'groupId cannot be empty' })
  groupId: mongoose.Schema.Types.ObjectId;

  @IsEnum(GROUP_ROLE, { message: 'Invalid role' })
  role: GROUP_ROLE;
}

export class UpdateGroupMemberDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid userId' })
  userId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid groupId' })
  groupId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsEnum(GROUP_ROLE, { message: 'Invalid role' })
  role?: GROUP_ROLE;
}
