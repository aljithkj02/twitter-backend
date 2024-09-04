import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTweetDto {
  @ApiProperty({
    example: '🚀 Just deployed my new project! Updated tweet!',
    required: true,
  })
  @IsNotEmpty({ message: 'content should not be empty!' })
  @IsString()
  content: string;
}
