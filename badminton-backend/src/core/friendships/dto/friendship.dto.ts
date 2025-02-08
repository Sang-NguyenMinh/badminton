import { IsMongoId, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { FRIENDSHIP_STATUS } from 'src/config/type';

export class CreateFriendshipDto {
  @IsMongoId({ message: 'Invalid userId1' })
  @IsNotEmpty({ message: 'userId1 cannot be empty' })
  userId1: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'Invalid userId2' })
  @IsNotEmpty({ message: 'userId2 cannot be empty' })
  userId2: mongoose.Schema.Types.ObjectId;

  @IsEnum(FRIENDSHIP_STATUS, { message: 'Invalid status' })
  status: FRIENDSHIP_STATUS;
}

export class UpdateFriendshipDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid userId1' })
  userId1?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid userId2' })
  userId2?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsEnum(FRIENDSHIP_STATUS, { message: 'Invalid status' })
  status?: FRIENDSHIP_STATUS;
}
