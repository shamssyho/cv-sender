import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
  @IsString()
  platform: string;

  @IsString()
  jobTitle: string;

  @IsString()
  jobUrl: string;

  @IsString()
  status: string;

  @IsOptional() // ✅ Rend `cvPath` optionnel si jamais il n'est pas fourni
  @IsString()
  cvPath?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // ✅ Convertit la date JSON en `Date`
  appliedAt?: Date;
}
