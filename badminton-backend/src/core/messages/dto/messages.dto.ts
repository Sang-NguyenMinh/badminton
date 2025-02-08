import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

export class CreateMessageDto {
  @IsMongoId({ message: 'Invalid _id' })
  senderId: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'Invalid _id' })
  conversationId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  messageType: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
