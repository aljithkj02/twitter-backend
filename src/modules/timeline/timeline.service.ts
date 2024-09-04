import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from '@modules/tweet/entities/tweet.entity';
import { User } from '@modules/user/entities/user.entity';
import { Follow } from '@modules/user/entities/follow.entity';
import { PaginationDto } from '@/common/dt0/pagination.dto';
import { PaginationService } from '@/common/services/pagination.service';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly paginationService: PaginationService,
  ) {}

  async getMyTimeline(user: User, { page, limit }: PaginationDto) {
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

    const tweetsDataQuery = this.getTweetsDataQuery(
      followedUserIds,
      page,
      limit,
    );

    const tweetsDataCountQuery = this.getTweetsDataCountQuery(followedUserIds);

    const data = await this.tweetRepository.query(tweetsDataQuery);
    const dataCount = await this.tweetRepository.query(tweetsDataCountQuery);

    const pagination = this.paginationService.createPaginationResponse(
      page,
      limit,
      dataCount[0].count,
    );

    return {
      data,
      pagination,
    };
  }

  private getTweetsDataCountQuery(ids: number[]) {
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
        WHERE "tweet"."authorId" IN (${ids.join(', ')})
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
        WHERE "retweet"."userId" IN (${ids.join(', ')})
    `;

    const combinedQuery = `
        SELECT COUNT(*) FROM (
            ${tweetsQuery}
            UNION
            ${retweetQuery}
        ) AS combinedResults
    `;
    return combinedQuery;
  }

  private getTweetsDataQuery(ids: number[], page: number, limit: number) {
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
        WHERE "tweet"."authorId" IN (${ids.join(', ')})
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
        WHERE "retweet"."userId" IN (${ids.join(', ')})
    `;

    const combinedQuery = `
        SELECT * FROM (
            ${tweetsQuery}
            UNION
            ${retweetQuery}
        ) AS combinedResults
        ORDER BY "createdAt" DESC
        ${this.paginationService.getPaginationQuery(page, limit)}
    `;
    return combinedQuery;
  }
}
