import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { FirebaseModule } from '@/infrastructure/firebase/firebase.module';
import { FollowModule } from './modules/follow/follow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    FirebaseModule,
    AuthModule,
    UserModule,
    FollowModule,
  ],
})
export class AppModule {}
