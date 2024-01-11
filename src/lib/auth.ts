import { env } from "@/env.mjs";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter, } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"
import { Adapter } from "next-auth/adapters";

export const MyAdapter = FirestoreAdapter({
    credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
    })
}) as Adapter;

export const authOptions: NextAuthOptions = {
    adapter: MyAdapter,
    session: {
        strategy: "database"
    },
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID || "",
            clientSecret: env.GOOGLE_CLIENT_SECRET || "",
        })
    ],
    callbacks: {
        async signIn(userDetail) {
            if (Object.keys(userDetail).length === 0) {
                return false;
            }
            return true;
        },
        async redirect({ baseUrl, url }) {
            return `${baseUrl}`;
        },
        async session({ session, token, user }) {
            const lulu = { ...session, user }
            return lulu
        },

    },
}