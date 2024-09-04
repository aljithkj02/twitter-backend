import { User } from '@/modules/user/entities/user.entity';
import { UserDto } from '@/modules/user/dto/user.dto';
import { FollowerDto, FollowingDto } from '@/modules/user/dto/follow.dto';

export class UserSerializer {
  static toDto(user: User): UserDto {
    const followers: FollowerDto[] = user.followers.map((follow) => ({
      id: follow.follower.id,
      name: follow.follower.name,
      email: follow.follower.email,
    }));

    const following: FollowingDto[] = user.following.map((follow) => ({
      id: follow.followee.id,
      name: follow.followee.name,
      email: follow.followee.email,
    }));

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      followers,
      following,
    };
  }

  static toDtos(users: User[]): UserDto[] {
    return users.map((user) => this.toDto(user));
  }
}
