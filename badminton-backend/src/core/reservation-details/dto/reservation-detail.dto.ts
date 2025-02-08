import { IsMongoId, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import mongoose, { Types } from 'mongoose';

export class CreateReservationDetailDto {
  @IsMongoId({ message: 'Invalid reservationID' })
  @IsNotEmpty({ message: 'reservationID cannot be empty' })
  reservationID: Types.ObjectId;

  @IsMongoId({ message: 'Invalid courtId' })
  @IsNotEmpty({ message: 'courtId cannot be empty' })
  courtId: Types.ObjectId;

  @IsOptional()
  reservationDate?: string|Date;

  startTime: string;

  endTime: string;

  @IsOptional()
  price:number
}

export class UpdateReservationDetailDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid reservationID' })
  reservationID?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Invalid courtId' })
  courtId?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsDate({ message: 'startTime must be a valid date' })
  startTime?: Date;

  @IsOptional()
  @IsDate({ message: 'endTime must be a valid date' })
  endTime?: Date;
}
