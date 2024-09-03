import { Module } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@modules/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
