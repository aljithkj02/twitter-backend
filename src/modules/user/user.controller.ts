import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FollowService } from '@modules/user/follow.service';
import { User } from './entities/user.entity';
import { Request } from 'express';

@ApiTags('Follow System')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly followService: FollowService,
  ) {}

  @Get('follow/:userId')
  follow(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Req() req: Request,
  ) {
    return this.followService.followUser(userId, req.user as User);
  }

  @Get('unfollow/:userId')
  unfollow(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Req() req: Request,
  ) {
    return this.followService.unfollowUser(userId, req.user as User);
  }

  @Get('')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
