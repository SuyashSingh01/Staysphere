import admin from "firebase-admin";
import { ENV } from "../constant/env.js";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      ENV.FIREBASE_SERVICE.FIREBASE_SERVICE_ACCOUNT_KEY
    ),
  });
}

const firebaseAuth = admin.auth();
export default firebaseAuth;
