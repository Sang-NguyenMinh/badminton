import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateReactionDto {
  @IsMongoId({ message: 'Invalid userId' })
  @IsNotEmpty({ message: 'userId cannot be empty' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'Invalid postId' })
  @IsNotEmpty({ message: 'postId cannot be empty' })
  postId: mongoose.Schema.Types.ObjectId;

  @IsString({ message: 'type must be a string' })
  @IsNotEmpty({ message: 'type cannot be empty' })
  type: string;
}

export class UpdateReactionDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid userId' })
  userId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid postId' })
  postId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'type must be a string' })
  type?: string;
}
