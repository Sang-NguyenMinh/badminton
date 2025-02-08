import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDate,
} from 'class-validator';
import mongoose from 'mongoose';
import { PAYMENT_METHOD, PAYMENT_STATUS } from 'src/config/type';

export class CreateInvoiceDto {
  @IsMongoId({ message: 'Invalid reservationId' })
  @IsNotEmpty({ message: 'reservationId cannot be empty' })
  reservationId: mongoose.Schema.Types.ObjectId;

  @IsDate({ message: 'invoiceDate must be a valid date' })
  @IsNotEmpty({ message: 'invoiceDate cannot be empty' })
  invoiceDate: Date;

  @IsOptional()
  @IsEnum(PAYMENT_STATUS, { message: 'Invalid payment status' })
  status?: PAYMENT_STATUS;

  @IsOptional()
  @IsEnum(PAYMENT_METHOD, { message: 'Invalid payment method' })
  paymentMethod?: PAYMENT_METHOD;

  @IsNumber({}, { message: 'totalAmount must be a number' })
  @IsNotEmpty({ message: 'totalAmount cannot be empty' })
  totalAmount: number;
}

export class UpdateInvoiceDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid reservationId' })
  reservationId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsDate({ message: 'invoiceDate must be a valid date' })
  invoiceDate?: Date;

  @IsOptional()
  @IsEnum(PAYMENT_STATUS, { message: 'Invalid payment status' })
  status?: PAYMENT_STATUS;

  @IsOptional()
  @IsEnum(PAYMENT_METHOD, { message: 'Invalid payment method' })
  paymentMethod?: PAYMENT_METHOD;

  @IsOptional()
  @IsNumber({}, { message: 'totalAmount must be a number' })
  totalAmount?: number;
}
