import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { FirebaseModule } from '@modules/firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    FirebaseModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
