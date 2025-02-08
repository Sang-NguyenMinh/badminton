import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import mongoose from 'mongoose';
import { ACCOUNT_TYPE, ROLES } from 'src/config/type';

export class CreateUserDto {
  @IsOptional()
  @IsString({ message: 'displayName must be a string' })
  displayName?: string;

  @IsOptional()
  @IsString({ message: 'username must be a string' })
  username?: string;

  @IsString({ message: 'password is required and must be a string' })
  password?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'phone must be a string' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'avatar must be a string' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'backgroundImage must be a string' })
  backgroundImage?: string;

  @IsOptional()
  @IsEnum(ROLES, { message: 'role must be one of the predefined roles' })
  role?: ROLES;

  @IsOptional()
  @IsEnum(ACCOUNT_TYPE, {
    message: 'accountType must be one of the predefined account types',
  })
  accountType?: ACCOUNT_TYPE;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsString({ message: 'codeId must be a string' })
  codeId?: string;

  @IsOptional()
  @IsDate({ message: 'codeExpired must be a valid date' })
  codeExpired?: Date;
}

export class UpdateUserDto {
  @IsMongoId({ message: 'Invalid _id' })
  @IsNotEmpty({ message: '_id do not empty' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'displayName must be a string' })
  displayName?: string;

  @IsOptional()
  @IsString({ message: 'username must be a string' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'password must be a string' })
  password?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'phone must be a string' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'avatar must be a string' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'backgroundImage must be a string' })
  backgroundImage?: string;

  @IsOptional()
  @IsEnum(ROLES, { message: 'role must be one of the predefined roles' })
  role?: ROLES;

  @IsOptional()
  @IsEnum(ACCOUNT_TYPE, {
    message: 'accountType must be one of the predefined account types',
  })
  accountType?: ACCOUNT_TYPE;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsString({ message: 'codeId must be a string' })
  codeId?: string;

  @IsOptional()
  @IsDate({ message: 'codeExpired must be a valid date' })
  codeExpired?: Date;
}
