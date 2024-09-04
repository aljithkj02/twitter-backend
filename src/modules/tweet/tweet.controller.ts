import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TweetService } from '@modules/tweet/tweet.service';
import { CreateTweetDto } from '@modules/tweet/dto/create-tweet.dto';
import { Request } from 'express';
import { User } from '@modules/user/entities/user.entity';
import { UpdateTweetDto } from '@modules/tweet/dto/update-tweet.dto';
import { LikeService } from '@modules/tweet/like.service';

@ApiTags('Tweets')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
@Controller('tweet')
export class TweetController {
  constructor(
    private readonly tweetService: TweetService,
    private readonly likeService: LikeService,
  ) {}

  @Get('all')
  @ApiOperation({
    summary: 'To get all the tweets. (for checking purpose)',
  })
  getAll() {
    return this.tweetService.getAllTweets();
  }

  @Post()
  @ApiOperation({
    summary: 'To create a new Tweet',
  })
  createTweet(@Body() createTweetDto: CreateTweetDto, @Req() req: Request) {
    return this.tweetService.createTweet(createTweetDto, req.user as User);
  }

  @Get('retweet/:id')
  @ApiOperation({
    summary: 'To retweet a tweet',
  })
  retweet(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number) {
    return this.tweetService.retweet(id, req.user as User);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'To update a tweet',
  })
  updateTweet(
    @Body() updateTweetDto: UpdateTweetDto,
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.tweetService.updateTweet(updateTweetDto, id, req.user as User);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'To delete a tweet',
  })
  deleteTweet(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.tweetService.deleteTweet(id, req.user as User);
  }

  @Get('like/:id')
  @ApiOperation({
    summary: 'To like a tweet',
  })
  likeTweet(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number) {
    return this.likeService.likeTweet(id, req.user as User);
  }

  @Get('unlike/:id')
  @ApiOperation({
    summary: 'To unlike a tweet',
  })
  unlikeTweet(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.likeService.unlikeTweet(id, req.user as User);
  }
}
