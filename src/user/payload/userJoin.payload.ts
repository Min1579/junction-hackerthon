import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, DisabledType } from '@prisma/client';

export class UserJoinPayload {
  @ApiProperty({ type: String })
  @IsString()
  email!: string;

  @ApiProperty({ type: String })
  @IsString()
  name!: string;

  @ApiProperty({ type: String })
  @IsString()
  password!: string;

  @ApiProperty({ type: String })
  @IsString()
  passwordCheck!: string;

  @ApiProperty({ enum: Object.keys(Role) })
  @IsEnum(Role)
  role!: Role;

  @ApiPropertyOptional({ enum: Object.keys(DisabledType) })
  @IsOptional()
  @IsEnum(DisabledType)
  disabledType!: DisabledType;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  companyName!: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  busId!: number;
}
