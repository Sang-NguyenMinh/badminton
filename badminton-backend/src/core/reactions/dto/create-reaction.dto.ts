import { IsMongoId, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateReactionDto {
  @IsMongoId()
  userId: mongoose.Types.ObjectId;

  @IsMongoId()
  postID: mongoose.Types.ObjectId;

  @IsString()
  reactionType: string;
}
