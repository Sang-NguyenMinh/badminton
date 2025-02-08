import { Optional } from '@nestjs/common';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';
import mongoose from 'mongoose';
import { POST_STATUS } from 'src/config/type';

export class CreatePostDto {
  @IsOptional()
  owner: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid groupId' })
  groupId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content cannot be empty' })
  content: string;

  @IsOptional()
  @IsArray({ message: 'images must be an array of strings' })
  @ArrayNotEmpty({ message: 'images array cannot be empty' })
  @IsString({ each: true, message: 'Each image must be a string' })
  images: string[];

  @IsOptional()
  @IsBoolean({ message: 'isLockComment must be a boolean' })
  isLockComment?: boolean;

  @IsOptional()
  @IsEnum(POST_STATUS, { message: 'Invalid post status' })
  status?: POST_STATUS;
}

export class UpdatePostDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid ownerId' })
  owner?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid groupId' })
  groupId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'content must be a string' })
  content?: string;

  @IsOptional()
  @IsArray({ message: 'images must be an array of strings' })
  @IsString({ each: true, message: 'Each image must be a string' })
  images?: string[];

  @IsOptional()
  @IsBoolean({ message: 'isLockComment must be a boolean' })
  isLockComment?: boolean;

  @IsOptional()
  @IsEnum(POST_STATUS, { message: 'Invalid post status' })
  status?: POST_STATUS;
}
