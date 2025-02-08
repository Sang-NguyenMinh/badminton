import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateReservationDto {
  @IsMongoId()
  userId: mongoose.Types.ObjectId;

  @IsOptional()
  reservationDate: Date;

  @IsOptional()
  status?: string;

  @IsOptional()
  totalAmount: number;
}
