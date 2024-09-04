import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Follow } from '@/modules/user/entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async followUser(followeeId: number, user: User) {
    if (followeeId === user.id) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    const followee = await this.userRepository.findOneBy({ id: followeeId });

    if (!followee) {
      throw new NotFoundException('User to follow not found.');
    }

    const isAlreadyFollowing = await this.followRepository.findOneBy({
      follower: { id: user.id },
      followee: { id: followee.id },
    });

    if (isAlreadyFollowing) {
      throw new BadRequestException(
        `You are already following ${followee.name}`,
      );
    }

    const follow = this.followRepository.create({
      follower: user,
      followee,
    });

    await this.followRepository.save(follow);

    return {
      statusCode: HttpStatus.OK,
      message: `You started following ${followee.name}`,
    };
  }

  async unfollowUser(followeeId: number, user: User) {
    if (followeeId === user.id) {
      throw new BadRequestException('You cannot unfollow yourself.');
    }

    const followee = await this.userRepository.findOneBy({ id: followeeId });

    if (!followee) {
      throw new NotFoundException('User to unfollow not found.');
    }

    const follow = await this.followRepository.findOneBy({
      follower: { id: user.id },
      followee: { id: followee.id },
    });

    if (!follow) {
      throw new BadRequestException(
        `You are not following ${followee.name}, so you cannot unfollow them.`,
      );
    }

    await this.followRepository.delete({
      follower: { id: user.id },
      followee: { id: followee.id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: `You have unfollowed ${followee.name}`,
    };
  }

  async getFollowers(userId: number): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followers', 'followers.follower'],
    });

    return user.followers.map((follow) => follow.follower);
  }

  async getFollowing(userId: number): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following', 'following.followee'],
    });

    return user.following.map((follow) => follow.followee);
  }
}
