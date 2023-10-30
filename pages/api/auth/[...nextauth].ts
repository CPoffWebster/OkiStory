import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

export default NextAuth(authOptions);



// import NextAuth, { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { verifyUserProvider } from "@/services/users";

// const authOptions: AuthOptions = {
//   secret: process.env.NEXT_AUTH_SECRET!,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code"
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async signIn({ profile }) {
//       try {
//         await verifyUserProvider(profile);
//         return true;
//       } catch (error) {
//         throw new Error("identity_provider_mismatch");
//       }
//     },
//   }
// };

// export default NextAuth(authOptions);


// import NextAuth, { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { verifyUserLogin, verifyUserProvider } from "@/services/users";
// // import FacebookProvider from "next-auth/providers/facebook";

// const authOptions: AuthOptions = {
//   secret: process.env.NEXT_AUTH_SECRET!,
//   providers: [
//     // CredentialsProvider({
//     //   credentials: {
//     //     email: { label: "Email", type: "text" },
//     //     password: { label: "Password", type: "password" }
//     //   },
//     //   async authorize(credentials: Record<"email" | "password", string> | undefined) {
//     //     const result = await verifyUserLogin(credentials!.email, credentials!.password);

//     //     if (!result) {
//     //       return null;
//     //     }

//     //     return {
//     //       id: credentials!.email
//     //     };
//     //   }
//     // }),
//     // GoogleProvider({
//     //   clientId: process.env.GOOGLE_CLIENT_ID!,
//     //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     // }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code"
//         }
//       }
//     })
//     // FacebookProvider({
//     //   clientId: process.env.FACEBOOK_CLIENT_ID!,
//     //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//     // }),
//   ],
//   pages: {
//     signIn: '/auth/identifier',
//     signOut: '/auth/identifier',
//     error: '/auth/identifier',
//   },
//   callbacks: {
//     async signIn({ account, profile, credentials }) {
//       try {
//         // if (!profile && credentials) {
//         //   return await verifyUserLogin(credentials.email.toString(), credentials.password.toString());
//         // }
//         await verifyUserProvider(profile);
//         return true;
//       } catch (error) {
//         throw new Error("identity_provider_mismatch");
//       }
//     },
//   }
// };

// export default NextAuth(authOptions);
