import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MissionStatus } from '../../schemas/mission.schema.js';

export class CreateMissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsString()
  @IsOptional()
  location?: string;
}

export class UpdateMissionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(MissionStatus)
  @IsOptional()
  status?: MissionStatus;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsNumber()
  @IsOptional()
  collected?: number;

  @IsString()
  @IsOptional()
  location?: string;
}
