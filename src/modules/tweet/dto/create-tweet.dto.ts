import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTweetDto {
  @ApiProperty({
    example:
      '🚀 Just deployed my new project! 🎉 It’s an app for managing tasks and collaborating with your team. Check it out and let me know what you think! #DevLife #NewRelease',
    required: true,
  })
  @IsNotEmpty({ message: 'content should not be empty!' })
  @IsString()
  content: string;
}
