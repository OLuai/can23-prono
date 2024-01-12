import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  server: {
    NEXTAUTH_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_CLIENT_EMAIL: z.string().min(1),
    FIREBASE_PRIVATE_KEY: z.string().min(1),
    FIRESTORE_API_KEY: z.string().min(1),
    FIRESTORE_AUTH_DOMAIN: z.string().min(1),
    FIRESTORE_STORAGE_BUCKET: z.string().min(1),
    FIRESTORE_MESSAGING_SENDER: z.string().min(1),
    FIRESTORE_APP_ID: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIRESTORE_API_KEY: process.env.FIRESTORE_API_KEY,
    FIRESTORE_AUTH_DOMAIN: process.env.FIRESTORE_AUTH_DOMAIN,
    FIRESTORE_STORAGE_BUCKET: process.env.FIRESTORE_STORAGE_BUCKET,
    FIRESTORE_MESSAGING_SENDER: process.env.FIRESTORE_MESSAGING_SENDER,
    FIRESTORE_APP_ID: process.env.FIRESTORE_STORAGE_BUCKET,
  },
})
