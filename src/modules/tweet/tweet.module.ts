import { Module } from '@nestjs/common';
import { TweetService } from '@modules/tweet/tweet.service';
import { TweetController } from '@modules/tweet/tweet.controller';

@Module({
  controllers: [TweetController],
  providers: [TweetService],
})
export class TweetModule {}
