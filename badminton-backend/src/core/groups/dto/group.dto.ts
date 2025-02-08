import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { GROUP_STATUS } from 'src/config/type';

export class CreateGroupDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  name: string;

  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description cannot be empty' })
  description: string;

  @IsOptional()
  @IsEnum(GROUP_STATUS, { message: 'Invalid status' })
  status?: GROUP_STATUS;
}

export class UpdateGroupDto {
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: string;

  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsOptional()
  @IsEnum(GROUP_STATUS, { message: 'Invalid status' })
  status?: GROUP_STATUS;
}
