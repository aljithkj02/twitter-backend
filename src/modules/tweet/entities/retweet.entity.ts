import { User } from '@/modules/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Tweet } from '@modules/tweet/entities/tweet.entity';

@Entity('retweets')
@Unique(['user', 'tweet'])
export class Retweet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.retweets, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Tweet, (tweet) => tweet.retweets, { onDelete: 'CASCADE' })
  tweet: Tweet;

  @CreateDateColumn()
  createdAt: Date;
}
