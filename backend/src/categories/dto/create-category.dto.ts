import { TransactionType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsString()
  @MaxLength(10)
  @IsOptional()
  icon?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  color?: string;
}
