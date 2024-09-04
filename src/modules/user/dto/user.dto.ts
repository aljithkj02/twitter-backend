import { FollowerDto, FollowingDto } from '@modules/user/dto/follow.dto';

export class UserDto {
  id: number;
  name: string;
  email: string;
  followers: FollowerDto[];
  following: FollowingDto[];
}
