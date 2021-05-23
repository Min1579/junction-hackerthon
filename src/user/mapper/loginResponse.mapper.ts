import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enum/role';

export class LoginResponseMapper {
  @ApiProperty({ type: String })
  @IsString()
  jwt!: string;

  @ApiProperty({ enum: Object.keys(Role) })
  @IsEnum(Role)
  role!: Role;
}
