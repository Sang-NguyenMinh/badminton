import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import mongoose from 'mongoose';
import { ITEM_STATUS } from 'src/config/type';

export class CreateItemDto {
  @IsMongoId({ message: 'Invalid facilityId' })
  @IsNotEmpty({ message: 'facilityId cannot be empty' })
  facilityId: mongoose.Schema.Types.ObjectId;

  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  name: string;

  @IsNumber({}, { message: 'price must be a number' })
  @IsNotEmpty({ message: 'price cannot be empty' })
  price: number;

  @IsNumber({}, { message: 'amount must be a number' })
  @IsNotEmpty({ message: 'amount cannot be empty' })
  amount: number;

  @IsEnum(ITEM_STATUS, { message: 'Invalid item status' })
  @IsNotEmpty({ message: 'status cannot be empty' })
  status: ITEM_STATUS;
}

export class UpdateItemDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid facilityId' })
  facilityId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'price must be a number' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'amount must be a number' })
  amount?: number;

  @IsOptional()
  @IsEnum(ITEM_STATUS, { message: 'Invalid item status' })
  status?: ITEM_STATUS;
}
