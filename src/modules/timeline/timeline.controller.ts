import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { TimelineService } from '@modules/timeline/timeline.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@modules/user/entities/user.entity';
import { PaginationDto } from '@/common/dt0/pagination.dto';

@ApiTags('Timeline')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve paginated timeline tweets for the authenticated user.',
    description:
      'Fetches tweets from the timeline of the authenticated user with support for pagination. Allows users to view their timeline tweets in a paginated format.',
  })
  getTimeline(@Req() req: Request, @Query() paginationDto: PaginationDto) {
    return this.timelineService.getMyTimeline(req.user as User, paginationDto);
  }
}
