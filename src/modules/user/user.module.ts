import { Module } from '@nestjs/common';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Follow } from '@modules/user/entities/follow.entity';
import { FollowService } from '@modules/user/follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  controllers: [UserController],
  providers: [UserService, FollowService],
})
export class UserModule {}
