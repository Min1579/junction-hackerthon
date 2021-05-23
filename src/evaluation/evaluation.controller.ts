import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EvaluationService } from './evaluation.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../shared/currentUser.decorator';
import { EvaluationCreatePayload } from './payload/evaluation.create.payload';

@ApiTags('버스기사님 평가')
@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly service: EvaluationService) {}

  @Post(':busId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async evaluateDriver(
    @CurrentUser() user,
    @Body() payload: EvaluationCreatePayload,
    @Param('busId', ParseIntPipe) busId: number,
  ) {
    return this.service.evaluateDriver(user.id, busId, payload);
  }
}
