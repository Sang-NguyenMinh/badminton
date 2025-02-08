import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  IsMongoId,
} from 'class-validator';

export class CreateCourtDto {
  @IsNotEmpty({ message: 'Facility ID is required' })
  facilityID: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Price per hour is required' })
  @IsNumber({}, { message: 'Price per hour must be a number' })
  pricePerHour: number;

  @IsOptional()
  status?: boolean;
}

export class UpdateCourtDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price per hour must be a number' })
  pricePerHour?: number;

  @IsOptional()
  status?: boolean;
}

export class CourtAvailabilityDto {
  @IsMongoId()
  facilityId: string;

  @IsOptional()
  date: string;
}


export class CheckAvailabilityDto {
  facilityId: string;
  date: string;
  startTime: string;
  endTime: string;
}
