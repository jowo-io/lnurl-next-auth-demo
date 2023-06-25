import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { kv } from "@vercel/kv";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  async signIn({ account, profile, credentials }) {
    console.log("callback signIn", { account, profile, credentials });
    if (account && account.provider === "lightning") {
      return true;
    }
    return true;
  },
  async jwt({ token, user, account, profile, session }) {
    console.log("callback jwt", {
      token,
      user,
      account,
      profile,
      session,
    });
    token.userRole = "admin";
    return token;
  },
  theme: { colorScheme: "light" },
  pages: {
    signIn: "/auth",
  },
  providers: [
    CredentialsProvider({
      id: "lightning",
      name: "Lightning",
      credentials: {
        pubkey: { label: "publickey", type: "text" },
        k1: { label: "k1", type: "text" },
      },
      async authorize(credentials, req) {
        console.log("authorize", credentials);
        const { k1, pubkey } = credentials || {};
        try {
          if (!k1 || !pubkey) throw new Error("Missing credentials");

          const data = await kv.get(`k1:${k1}`);

          console.log({ data });

          await kv.set(`k1:${k1}`, null);

          if (data?.pubkey === pubkey) {
            return {
              pubkey,
              role: "user",
              email: "foo@foo.com",
            };
          }
        } catch (error) {
          console.log(error);
        }

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
