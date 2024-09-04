import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'To follow a user' })
  follow(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Req() req: Request,
  ) {
    return this.followService.followUser(userId, req.user as User);
  }

  @Get('unfollow/:userId')
  @ApiOperation({ summary: 'To unfollow a user' })
  unfollow(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Req() req: Request,
  ) {
    return this.followService.unfollowUser(userId, req.user as User);
  }

  @Get('all')
  @ApiOperation({
    summary: 'To get all the users data in the app. (for checking purpose)',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'To get a single user data by user id. (for checking purpose)',
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
