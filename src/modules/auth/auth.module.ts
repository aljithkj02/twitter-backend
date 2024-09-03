import { Module } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@modules/user/entities/user.entity';
import { FirebaseService } from '@/infrastructure/firebase/firebase.service';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from '@/common/strategies/firebase-auth.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PassportModule],
  controllers: [AuthController],
  providers: [FirebaseAuthStrategy, AuthService, FirebaseService],
})
export class AuthModule {}
