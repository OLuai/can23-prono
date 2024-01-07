import { env } from "@/env.mjs";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
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
            console.log("Nous avons un utilisateur", userDetail);
            return true;
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}`;
        },
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            console.log("token :: ", token)
            // console.log("account :: ", account)
            token.luai = "account.access_token"
            return token
        },
        async session({ session, token, user }) {
            // console.log("session :: ", session)
            console.log("user :: ", user)
            // Send properties to the client, like an access_token from a provider.
            const lulu = { ...session, luai: token.luai }
            return lulu
        }
    },
}