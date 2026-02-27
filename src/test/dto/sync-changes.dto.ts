import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class SyncChangesDto {
 /*  @IsInt()
  lastChangeId: number; */

  @IsString()
  lastChangeId: string;

  @IsOptional()
  @IsArray()
  tables?: string[];
}

