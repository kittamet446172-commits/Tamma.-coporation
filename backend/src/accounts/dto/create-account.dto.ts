import { AccountType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsEnum(AccountType)
  type!: AccountType;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;
}
