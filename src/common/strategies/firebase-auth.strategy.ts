import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import * as FirebaseAdmin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super();
  }

  async validate(token: string): Promise<UserEntity> {
    try {
      const { email } = await FirebaseAdmin.auth().verifyIdToken(token);

      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        new UnauthorizedException('No such user exist!');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
