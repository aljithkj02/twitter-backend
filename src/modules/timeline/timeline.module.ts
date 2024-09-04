import { Module } from '@nestjs/common';
import { TimelineService } from '@modules/timeline/timeline.service';
import { TimelineController } from '@modules/timeline/timeline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from '@modules/tweet/entities/tweet.entity';
import { Follow } from '@modules/user/entities/follow.entity';
import { PaginationService } from '@/common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet, Follow])],
  controllers: [TimelineController],
  providers: [TimelineService, PaginationService],
})
export class TimelineModule {}
