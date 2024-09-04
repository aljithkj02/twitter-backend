import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTweetDto } from '@modules/tweet/dto/create-tweet.dto';
import { User } from '@modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from '@modules/tweet/entities/tweet.entity';
import { Repository } from 'typeorm';
import { UpdateTweetDto } from '@modules/tweet/dto/update-tweet.dto';
import { TweetSerializer } from './serializers/tweet.serializer';
import { Retweet } from '@modules/tweet/entities/retweet.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    @InjectRepository(Retweet)
    private readonly retweetRepository: Repository<Retweet>,
  ) {}

  async getAllTweets() {
    const tweets = await this.tweetRepository
      .createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.author', 'author')
      .leftJoinAndSelect('tweet.likes', 'like')
      .leftJoinAndSelect('like.user', 'likedUser')
      .leftJoinAndSelect('tweet.retweets', 'retweet')
      .leftJoinAndSelect('retweet.user', 'retweetedUser')
      .select([
        'tweet.id',
        'tweet.content',
        'author.name',
        'author.email',
        'like.id',
        'likedUser.name',
        'retweet.id',
        'retweetedUser.name',
      ])
      .getMany();

    return tweets.map((tweet) => TweetSerializer.serializeTweet(tweet));
  }

  async createTweet({ content }: CreateTweetDto, user: User) {
    const tweet = this.tweetRepository.create({
      content,
      author: user,
    });

    await this.tweetRepository.save(tweet);

    return {
      status: HttpStatus.CREATED,
      message: 'Successfully tweeted!',
    };
  }

  async updateTweet({ content }: UpdateTweetDto, tweetId: number, user: User) {
    const tweet = await this.tweetRepository.findOneBy({
      id: tweetId,
      author: { id: user.id },
    });

    if (!tweet) {
      throw new NotFoundException('No such tweet exist!');
    }

    tweet.content = content;
    await this.tweetRepository.save(tweet);

    return {
      status: HttpStatus.CREATED,
      message: 'Successfully updated the tweet!',
    };
  }

  async deleteTweet(tweetId: number, user: User) {
    const tweet = await this.tweetRepository.findOneBy({
      id: tweetId,
      author: { id: user.id },
    });

    if (!tweet) {
      throw new NotFoundException('No such tweet exist!');
    }

    await this.tweetRepository.delete({ id: tweetId });

    return {
      status: HttpStatus.OK,
      message: 'Successfully deleted the tweet!',
    };
  }

  async retweet(id: number, user: User) {
    const tweet = await this.tweetRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!tweet) {
      throw new NotFoundException('Tweet not found!');
    }

    if (tweet.author.id === user.id) {
      throw new BadRequestException('You cannot retweet your own tweet!');
    }

    const isRetweeted = await this.retweetRepository.findOneBy({
      user: { id: user.id },
      tweet: { id: tweet.id },
    });

    if (isRetweeted) {
      throw new BadRequestException('You have already retweeted this post!');
    }

    const retweet = this.retweetRepository.create({
      user,
      tweet,
    });
    await this.retweetRepository.save(retweet);

    return {
      status: HttpStatus.OK,
      message: 'Successfully retweeted the post!',
    };
  }
}
