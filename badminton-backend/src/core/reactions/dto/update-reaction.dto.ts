import { PartialType } from '@nestjs/mapped-types';
import { CreateReactionDto } from './create-reaction.dto';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateReactionDto extends PartialType(CreateReactionDto) {
  @IsMongoId()
  _id: mongoose.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  userId: mongoose.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  postID: mongoose.Types.ObjectId;

  @IsOptional()
  reactionType: string;
}
