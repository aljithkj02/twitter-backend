import { Module, OnApplicationBootstrap } from '@nestjs/common';
import * as FirebaseClient from 'firebase/app';
import * as FirebaseAdmin from 'firebase-admin';
import { readFile } from 'fs/promises';
import * as path from 'path';

@Module({})
export class FirebaseModule implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    FirebaseAdmin.initializeApp({
      credential: FirebaseAdmin.credential.cert(
        path.join(
          __dirname,
          '..',
          'firebase',
          'certificates',
          'firebase-service-account-key.json',
        ),
      ),
    });

    const clientConfigJsonString = await readFile(
      path.join(
        __dirname,
        '..',
        'firebase',
        'certificates',
        'firebase-client-config.json',
      ),
      'utf-8',
    );
    FirebaseClient.initializeApp(
      JSON.parse(clientConfigJsonString) as FirebaseClient.FirebaseOptions,
    );
  }
}
