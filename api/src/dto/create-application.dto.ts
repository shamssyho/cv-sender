import { IsString, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  platform: string;

  @IsString()
  jobTitle: string;

  @IsString()
  jobUrl: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  cvPath?: string;
}
