import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';
import { PAYMENT_METHOD } from 'src/config/type';


interface CourtParams{
  id:string,
  startTime:string,
  endTime:string,
  price:number
}

export class CreateReservationDto {
  @IsMongoId()
  userId: mongoose.Types.ObjectId;

  @IsMongoId()
  facility: mongoose.Types.ObjectId;

  @IsOptional() 
  status?: string;

  @IsOptional()
  paymentMethod:PAYMENT_METHOD

  @IsOptional()
  reservationDate?: string|Date;

  @IsOptional()
  totalAmount: number;

  @IsOptional()
  courts:CourtParams[]
}
