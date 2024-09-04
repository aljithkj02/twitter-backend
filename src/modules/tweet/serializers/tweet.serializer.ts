import { Tweet } from '@modules/tweet/entities/tweet.entity';
import { Like } from '@modules/tweet/entities/like.entity';
import { Retweet } from '@modules/tweet/entities/retweet.entity';

export class TweetSerializer {
  static serializeTweet(tweet: Tweet) {
    return {
      id: tweet.id,
      content: tweet.content,
      author: {
        name: tweet.author.name,
        email: tweet.author.email,
      },
      likes: tweet.likes.map((like: Like) => ({
        id: like.id,
        name: like.user.name,
      })),
      retweets: tweet.retweets.map((retweet: Retweet) => ({
        id: retweet.id,
        name: retweet.user.name,
      })),
    };
  }
}
