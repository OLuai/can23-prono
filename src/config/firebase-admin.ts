import { env } from "@/env.mjs";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";


interface FirebaseAdminAppParams {
    projectId: string;
    clientEmail: string;
    storageBucket: string;
    privateKey: string;
}

function formatPrivateKey(key: string) {
    return key.replaceAll(/\\n/g, "\n");
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {

    const privateKey = formatPrivateKey(params.privateKey)
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const cert = admin.credential.cert({
        projectId: params.projectId,
        clientEmail: params.clientEmail,
        privateKey
    });

    return admin.initializeApp({
        credential: cert,
        projectId: params.projectId,
        storageBucket: params.storageBucket,
    })
}

export function initAdmin() {
    const params = {
        projectId: env.FIREBASE_PROJECT_ID as string,
        clientEmail: env.FIREBASE_CLIENT_EMAIL as string,
        storageBucket: env.FIRESTORE_STORAGE_BUCKET as string,
        privateKey: env.FIREBASE_PRIVATE_KEY as string,
    }

    return createFirebaseAdminApp(params);
}

export function getDB() {
    const adminApp = initAdmin();

    const db = getFirestore(adminApp);
    return db;
}