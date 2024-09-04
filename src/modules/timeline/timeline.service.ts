import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from '@modules/tweet/entities/tweet.entity';
import { User } from '@modules/user/entities/user.entity';
import { Follow } from '@modules/user/entities/follow.entity';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
  ) {}

  async getMyTimeline(user: User) {
    const followings = await this.followRepository
      .createQueryBuilder('follow')
      .select('follow.followeeId')
      .where('follow.followerId = :userId', { userId: user.id })
      .getRawMany();

    const followedUserIds: number[] = followings.map(
      (follow) => follow.followeeId,
    );

    if (!followedUserIds.length) {
      return {
        data: [],
        message: 'No followed users',
      };
    }

    const tweetsQuery = `
        SELECT 
            "tweet"."id" AS "id", 
            "tweet"."content" AS "content", 
            "tweet"."createdAt" AS "createdAt", 
            "tweet"."authorId" AS "authorId", 
            "author"."name" AS "authorName", 
            NULL AS "retweetedBy"
        FROM "tweets" "tweet" 
        LEFT JOIN "users" "author" ON "author"."id"="tweet"."authorId"
        WHERE "tweet"."authorId" IN (${followedUserIds.join(', ')})
    `;

    const retweetQuery = `
        SELECT 
            "tweet"."id" AS "id", 
            "tweet"."content" AS "content",
            "retweet"."createdAt" AS "createdAt", 
            "author"."id" AS "authorId", 
            "author"."name" AS "authorName",
            "user"."name" AS "retweetedBy"
        FROM "retweets" "retweet" 
        LEFT JOIN "tweets" "tweet" ON "tweet"."id"="retweet"."tweetId" 
        LEFT JOIN "users" "user" ON "user"."id"="retweet"."userId" 
        LEFT JOIN "users" "author" ON "author"."id"="tweet"."authorId" 
        WHERE "retweet"."userId" IN (${followedUserIds.join(', ')})
    `;

    const combinedQuery = `
        SELECT * FROM (
            ${tweetsQuery}
            UNION
            ${retweetQuery}
        ) AS combinedResults
        ORDER BY "createdAt" DESC;
    `;

    const data = await this.tweetRepository.query(combinedQuery);

    return data;
  }
}
