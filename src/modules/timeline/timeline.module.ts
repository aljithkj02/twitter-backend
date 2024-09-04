import { Module } from '@nestjs/common';
import { TimelineService } from '@modules/timeline/timeline.service';
import { TimelineController } from '@modules/timeline/timeline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from '@modules/tweet/entities/tweet.entity';
import { Follow } from '@modules/user/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet, Follow])],
  controllers: [TimelineController],
  providers: [TimelineService],
})
export class TimelineModule {}
