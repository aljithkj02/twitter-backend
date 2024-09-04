import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TimelineService } from '@modules/timeline/timeline.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@modules/user/entities/user.entity';

@ApiTags('Timeline')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get('')
  getTimeline(@Req() req: Request) {
    return this.timelineService.getMyTimeline(req.user as User);
  }
}
