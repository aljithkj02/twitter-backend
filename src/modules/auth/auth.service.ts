import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '@modules/auth/dto/register-user.dto';
import * as FirebaseAuth from 'firebase/auth';
import { LoginUserDto } from '@modules/auth/dto/login-user.dto';
import { FirebaseClientService } from '@modules/firebase/firebase-client.service';
import { FirebaseError } from 'firebase/app';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly firebaseClientService: FirebaseClientService,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async registerUser({ name, email, password }: RegisterUserDto) {
    try {
      const isUserExist = await this.userRepository.findOneBy({
        email,
      });

      if (isUserExist) {
        throw new ConflictException('User with this email already exists.');
      }

      const userCredential = await FirebaseAuth.createUserWithEmailAndPassword(
        FirebaseAuth.getAuth(),
        email,
        password,
      );

      const user = this.userRepository.create({
        name,
        email,
      });

      await this.userRepository.save(user);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        acceessToken: await userCredential.user.getIdToken(),
      };
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.firebaseClientService.handleFirebaseError(error);
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: (error as Error).message,
        };
      }
    }
  }

  async loginUser({ email, password }: LoginUserDto) {
    try {
      const isUserExist = await this.userRepository.findOneBy({
        email,
      });

      if (!isUserExist) {
        throw new NotFoundException('User with this email does not exist.');
      }

      const userCredential = await FirebaseAuth.signInWithEmailAndPassword(
        FirebaseAuth.getAuth(),
        email,
        password,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Sign-in successful',
        acceessToken: await userCredential.user.getIdToken(),
      };
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.firebaseClientService.handleFirebaseError(error);
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: (error as Error).message,
        };
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
