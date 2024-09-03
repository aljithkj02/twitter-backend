import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  private firebaseAdmin: admin.app.App;

  constructor() {
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  getAuth() {
    return this.firebaseAdmin.auth();
  }
}
