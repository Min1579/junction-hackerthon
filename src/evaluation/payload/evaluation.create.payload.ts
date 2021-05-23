import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EvaluationCreatePayload {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  point!: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  speedPoint!: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  kindPoint!: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  memo!: string;
}
