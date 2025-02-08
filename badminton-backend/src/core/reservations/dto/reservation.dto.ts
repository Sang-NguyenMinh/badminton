import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import mongoose from 'mongoose';
import { PAYMENT_METHOD, PAYMENT_STATUS } from 'src/config/type';

export class CreateReservationDto {
  @IsMongoId({ message: 'Invalid userId' })
  @IsNotEmpty({ message: 'userId cannot be empty' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsEnum(PAYMENT_STATUS, { message: 'Invalid payment status' })
  status?: PAYMENT_STATUS;

  @IsOptional()
  @IsNumber({}, { message: 'Total amount must be a number' })
  totalAmount?: number;

  @IsOptional()
  @IsEnum(PAYMENT_METHOD, { message: 'Invalid payment method' })
  paymentMethod?: PAYMENT_METHOD;
}

export class UpdateReservationDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsEnum(PAYMENT_STATUS, { message: 'Invalid payment status' })
  status?: PAYMENT_STATUS;

  @IsOptional()
  @IsNumber({}, { message: 'Total amount must be a number' })
  totalAmount?: number;

  @IsOptional()
  @IsEnum(PAYMENT_METHOD, { message: 'Invalid payment method' })
  paymentMethod?: PAYMENT_METHOD;
}
