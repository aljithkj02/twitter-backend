import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { UserSerializer } from '@modules/user/serializers/user.serializer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({
      relations: [
        'followers',
        'followers.follower',
        'following',
        'following.followee',
      ],
    });

    return UserSerializer.toDtos(users);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'followers',
        'followers.follower',
        'following',
        'following.followee',
      ],
    });

    if (!user) {
      throw new NotFoundException('No such user exist!');
    }

    return UserSerializer.toDto(user);
  }
}
