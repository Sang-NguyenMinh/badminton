import { IsMongoId, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import mongoose from 'mongoose';

export class CreateInvoiceDetailDto {
  @IsMongoId({ message: 'Invalid invoiceId' })
  @IsNotEmpty({ message: 'invoiceId cannot be empty' })
  invoiceId: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'Invalid itemId' })
  @IsNotEmpty({ message: 'itemId cannot be empty' })
  itemId: mongoose.Schema.Types.ObjectId;

  @IsNumber({}, { message: 'quantity must be a number' })
  @IsNotEmpty({ message: 'quantity cannot be empty' })
  quantity: number;

  @IsNumber({}, { message: 'currentPrice must be a number' })
  @IsNotEmpty({ message: 'currentPrice cannot be empty' })
  currentPrice: number;
}

export class UpdateInvoiceDetailDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid invoiceId' })
  invoiceId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid itemId' })
  itemId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsNumber({}, { message: 'quantity must be a number' })
  quantity?: number;

  @IsOptional()
  @IsNumber({}, { message: 'currentPrice must be a number' })
  currentPrice?: number;
}
