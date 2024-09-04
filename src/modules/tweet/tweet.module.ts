import { Module } from '@nestjs/common';
import { TweetService } from '@modules/tweet/tweet.service';
import { TweetController } from '@modules/tweet/tweet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from '@modules/tweet/entities/tweet.entity';
import { User } from '@modules/user/entities/user.entity';
import { Retweet } from '@modules/tweet/entities/retweet.entity';
import { Like } from '@modules/tweet/entities/like.entity';
import { LikeService } from '@modules/tweet/like.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet, User, Retweet, Like])],
  controllers: [TweetController],
  providers: [TweetService, LikeService],
})
export class TweetModule {}
