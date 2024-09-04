import { Controller } from '@nestjs/common';
import { TimelineService } from '@modules/timeline/timeline.service';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}
}
