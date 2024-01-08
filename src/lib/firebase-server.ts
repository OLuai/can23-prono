import { getAuth } from "firebase-admin/auth";
import admin, { ServiceAccount } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { asyncMap, findMany } from "@/adapters/utils";
import FirebaseAdapter from "@/adapters/firebase-adapter";
import { env } from "@/env.mjs";

// https://github.com/vercel/next.js/issues/1999#issuecomment-302244429
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    })
  });
}

export const app = admin.apps[0];

export const auth = getAuth();

export const db = getFirestore();


export type CustomToken = {
  token: string;
  expires: string; // date
};

export async function getCustomToken(sessionToken: string) {
  const tokenDocRef = db.collection('_next_auth_firebase_adapter_').doc('store').collection('customToken').doc(sessionToken);
  const tokenDoc = await tokenDocRef.get();
  if (!tokenDoc.exists) return;
  const { token, expires } = tokenDoc.data() as CustomToken;
  if (Date.now() > new Date(expires).getTime()) return;
  return token;
}

export async function updateCustomToken(sessionToken: string, token: string) {
  const tokenDocRef = db.collection('_next_auth_firebase_adapter_').doc('store').collection('customToken').doc(sessionToken);

  await tokenDocRef.set({
    token,
    expires: Date.now() + 60 * 60 * 1000,
  });

  return token;
}

export function getSessionToken(req: NextApiRequest) {
  return (req.cookies['__Secure-next-auth.session-token'] ?? req.cookies['next-auth.session-token']) || "";
}

export function createFirebaseCustomTokenHandler({
  method = 'GET',
  additionalClaims,
}: {
  method?: string;
  additionalClaims?: (session: Session) => any;
}) {

  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) return res.status(403).json(false);
    const session = await getSession({ req }) as Session;
    if (!session) return res.status(403).json(false);
    const sessionToken = getSessionToken(req);
    const { user } = session as unknown as {
      user: NonNullable<Session['user']>;
    };
    const email = user.email as string;
    let token = await getCustomToken(sessionToken);
    if (token) return res.json(token);

    token = await admin
      .auth()
      .createCustomToken(email, Object.assign({}, additionalClaims?.(session), { sessionToken }));

    await updateCustomToken(sessionToken, token);

    return res.json(token);
  };
}

// export async function removeExpiredSessions(limit: number = 100, asyncMax: number = 30) { // Expired session deletion function, used for cron or api
//   const adapter = FirebaseAdapter(db);

//   const q = db.collection('_next_auth_firebase_adapter_').doc('store').collection('session').where('expires', '<', new Date()).limit(limit);
//   const expiredSessionDocs = await findMany(q);
//   await asyncMap(expiredSessionDocs.map(doc => () => adapter.deleteSession(doc.data().sessionToken) as Promise<void>), asyncMax);
// }