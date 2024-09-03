import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseError } from 'firebase/app';

@Injectable()
export class FirebaseClientService {
  getClientConfig() {
    return {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };
  }

  handleFirebaseError(error: FirebaseError): void {
    switch (error.code) {
      case 'auth/invalid-credential':
        throw new UnauthorizedException('Invalid credential');
      default:
        throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
