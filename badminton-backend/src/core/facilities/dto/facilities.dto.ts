import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';
import { WEEKDAY } from 'src/config/type';

export class CreateFacilityDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  address: string;

  @IsOptional()
  @IsArray({ message: 'Hotline must be an array of strings' })
  @IsString({ each: true, message: 'Each hotline must be a string' })
  hotline?: string[];

  @IsNotEmpty({ message: 'Start time is required' })
  @IsDateString({}, { message: 'Start time must be a valid date string' })
  startTime: string;

  @IsNotEmpty({ message: 'End time is required' })
  @IsDateString({}, { message: 'End time must be a valid date string' })
  endTime: string;

  @IsOptional()
  @IsArray({ message: 'Working days must be an array' })
  @IsEnum(WEEKDAY, {
    each: true,
    message: 'Each working day must be a valid weekday',
  })
  workingDays?: WEEKDAY[];
}

export class UpdateFacilityDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @IsOptional()
  @IsArray({ message: 'Hotline must be an array of strings' })
  @IsString({ each: true, message: 'Each hotline must be a string' })
  hotline?: string[];

  @IsOptional()
  startTime?: string;

  @IsOptional()
  endTime?: string;

  @IsOptional()
  @IsArray({ message: 'Working days must be an array' })
  @IsEnum(WEEKDAY, {
    each: true,
    message: 'Each working day must be a valid weekday',
  })
  workingDays?: WEEKDAY[];
}
