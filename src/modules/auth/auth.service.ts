/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '@modules/auth/dto/register-user.dto';
import * as FirebaseAuth from 'firebase/auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

    const userCredential = await FirebaseAuth.createUserWithEmailAndPassword(
      FirebaseAuth.getAuth(),
      email,
      password,
    );

    const user = this.userRepository.create({
      name,
      email,
      password,
    });

    await this.userRepository.save(user);

    console.log(await userCredential.user.getIdToken());

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
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
