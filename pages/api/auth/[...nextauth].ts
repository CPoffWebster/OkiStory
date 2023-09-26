import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verifyUserLogin } from "@/services/users";
// import FacebookProvider from "next-auth/providers/facebook";

const authOptions: AuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET!,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        const result = await verifyUserLogin(credentials!.email, credentials!.password);

        if (!result) {
          return null;
        }

        return {
          id: credentials!.email
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // }),
  ],
  pages: {
    signIn: '/auth/identifier',
    signOut: '/auth/identifier',
    error: '/auth/identifier',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Your Sign In logic here
        console.log('SIGN IN CALLED HERE', user, account, profile, email, credentials)
        return true;
      } catch (error) {
        console.error("Sign In Error", error);
        return false;
      }
    },
  }
};

export default NextAuth(authOptions);
