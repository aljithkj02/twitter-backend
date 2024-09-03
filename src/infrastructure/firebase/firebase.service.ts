import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseError } from 'firebase/app';

@Injectable()
export class FirebaseService {
  handleFirebaseError(error: FirebaseError): void {
    switch (error.code) {
      case 'auth/invalid-credential':
        throw new UnauthorizedException('Invalid credential');
      default:
        throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
