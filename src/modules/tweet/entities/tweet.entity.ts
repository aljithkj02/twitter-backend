import { User } from '@/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from '@modules/tweet/entities/like.entity';
import { Retweet } from './retweet.entity';

@Entity('tweets')
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tweets, { onDelete: 'CASCADE' })
  author: User;

  @OneToMany(() => Like, (like) => like.tweet, { cascade: true })
  likes: Like[];

  @OneToMany(() => Retweet, (retweet) => retweet.tweet, { cascade: true })
  retweets: Retweet[];
}
