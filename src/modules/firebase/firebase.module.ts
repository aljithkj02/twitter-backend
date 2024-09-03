import { Module, OnApplicationBootstrap } from '@nestjs/common';
import * as FirebaseClient from 'firebase/app';
import { FirebaseClientService } from './firebase-client.service';

@Module({
  providers: [FirebaseClientService],
  exports: [FirebaseClientService],
})
export class FirebaseModule implements OnApplicationBootstrap {
  constructor(private readonly firebaseClientService: FirebaseClientService) {}

  async onApplicationBootstrap() {
    FirebaseClient.initializeApp(this.firebaseClientService.getClientConfig());
  }
}
