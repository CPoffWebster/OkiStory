import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { checkLoginDB } from "@/services/users";
// import AppleProvider from "next-auth/providers/apple"

export const authOptions = {
  secret: process.env.NEXT_AUTH_SECRET!,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        const result = await checkLoginDB(credentials!.email, credentials!.password);

        if (result.error) {
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
  // pages: {
  // signIn: '/auth/identifier',
  // signOut: '/auth/signout',
  // error: '/auth/error', // Error code passed in query string as ?error=
  // verifyRequest: '/auth/verify-request', // (used for check email message)
  // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  // }
};

export default NextAuth(authOptions)