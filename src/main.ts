import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const options = new DocumentBuilder()
    .setTitle('Twitter Clone API')
    .setDescription(
      'This API powers a Twitter-like application, providing endpoints for user management, tweet functionalities, follow system, and timeline features. Users can register, log in via Firebase authentication, post tweets, like, retweet, and follow other users. The API is designed using NestJS and PostgreSQL, ensuring scalable and maintainable code.',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addServer('https://production.yourapi.com/', 'Production')
    .addTag('Auth', 'Endpoints related to user registration & login.')
    .addTag('Tweets', 'Endpoints for creating, liking, and retweeting tweets.')
    .addTag('Follow System', 'Endpoints for following and unfollowing users.')
    .addTag(
      'Timeline',
      'Endpoints for retrieving the user timeline with pagination support.',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
