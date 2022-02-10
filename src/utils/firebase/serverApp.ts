import * as admin from "firebase-admin";
import nookies from "nookies";
import type { GetServerSidePropsContext } from "next";
import type { ParsedUrlQuery } from "querystring";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!privateKey) throw new Error("private key not found at serverApp.ts ");
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

const adminDB = admin.firestore();
const auth = admin.auth();

export { adminDB, auth };

export const getUser = (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, any>
) => {
  const { token } = nookies.get(ctx);
  return admin.auth().verifyIdToken(token);
};

// https://firebase.google.com/docs/emulator-suite/connect_auth#node.js-admin-sdk

// how to kill if port still running:
// sudo lsof -i :8080
// kill -9 <PID>
