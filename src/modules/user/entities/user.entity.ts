import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Follow } from '@/modules/user/entities/follow.entity';
import { Tweet } from '@/modules/tweet/entities/tweet.entity';
import { Like } from '@/modules/tweet/entities/like.entity';
import { Retweet } from '@/modules/tweet/entities/retweet.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.followee)
  followers: Follow[];

  @OneToMany(() => Tweet, (tweet) => tweet.author, { cascade: true })
  tweets: Tweet[];

  @OneToMany(() => Like, (like) => like.user, { cascade: true })
  likes: Like[];

  @OneToMany(() => Retweet, (retweet) => retweet.user, { cascade: true })
  retweets: Retweet[];
}
