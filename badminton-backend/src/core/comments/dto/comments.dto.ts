import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsNotEmpty({ message: 'Post ID is required' })
  postId: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @IsOptional()
  @IsArray({ message: 'Images must be an array of strings' })
  @IsString({ each: true, message: 'Each image must be a string' })
  images?: string[];
}

export class UpdateCommentDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @IsOptional()
  @IsArray({ message: 'Images must be an array of strings' })
  @IsString({ each: true, message: 'Each image must be a string' })
  images?: string[];
}
