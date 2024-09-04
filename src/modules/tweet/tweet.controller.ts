import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TweetService } from '@modules/tweet/tweet.service';
import { CreateTweetDto } from '@modules/tweet/dto/create-tweet.dto';
import { Request } from 'express';
import { User } from '@modules/user/entities/user.entity';
import { UpdateTweetDto } from '@modules/tweet/dto/update-tweet.dto';

@ApiTags('Tweets')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  createTweet(@Body() createTweetDto: CreateTweetDto, @Req() req: Request) {
    return this.tweetService.createTweet(createTweetDto, req.user as User);
  }

  @Put(':id')
  updateTweet(
    @Body() updateTweetDto: UpdateTweetDto,
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.tweetService.updateTweet(updateTweetDto, id, req.user as User);
  }

  @Delete(':id')
  deleteTweet(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.tweetService.deleteTweet(id, req.user as User);
  }
}
