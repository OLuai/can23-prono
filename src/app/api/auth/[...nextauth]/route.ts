import { env } from "@/env.mjs";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
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
  },
});

export { handler as GET, handler as POST };
