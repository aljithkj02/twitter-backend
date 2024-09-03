import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '@modules/auth/dto/register-user.dto';
import * as FirebaseAuth from 'firebase/auth';
import { LoginUserDto } from '@modules/auth/dto/login-user.dto';
import { FirebaseService } from '@/infrastructure/firebase/firebase.service';
import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async registerUser({ name, email, password }: RegisterUserDto) {
    const isUserExist = await this.userRepository.findOneBy({
      email,
    });

    if (isUserExist) {
      throw new ConflictException('User with this email already exists.');
    }

    let userCredential: UserCredential;
    try {
      userCredential = await FirebaseAuth.createUserWithEmailAndPassword(
        FirebaseAuth.getAuth(),
        email,
        password,
      );
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.firebaseService.handleFirebaseError(error);
      }
    }

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
  }

  async loginUser({ email, password }: LoginUserDto) {
    const isUserExist = await this.userRepository.findOneBy({
      email,
    });

    if (!isUserExist) {
      throw new NotFoundException('User with this email does not exist.');
    }

    let userCredential: UserCredential;
    try {
      userCredential = await FirebaseAuth.signInWithEmailAndPassword(
        FirebaseAuth.getAuth(),
        email,
        password,
      );
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.firebaseService.handleFirebaseError(error);
      }
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Sign-in successful',
      acceessToken: await userCredential.user.getIdToken(),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
