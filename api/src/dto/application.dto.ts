import { IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  platform: string;

  @IsString()
  jobTitle: string;

  @IsString()
  status: string;
}
