import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Like } from '@modules/tweet/entities/like.entity';
import { Tweet } from '@modules/tweet/entities/tweet.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async likeTweet(tweetId: number, user: User) {
    const tweet = await this.tweetRepository.findOneBy({ id: tweetId });

    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }

    const existingLike = await this.likeRepository.findOneBy({
      id: user.id,
      tweet: { id: tweetId },
    });

    if (existingLike) {
      throw new BadRequestException('You have already liked this tweet');
    }

    const like = this.likeRepository.create({
      tweet,
      user,
    });
    await this.likeRepository.save(like);

    return {
      status: HttpStatus.OK,
      message: 'You liked the tweet!',
    };
  }
}
