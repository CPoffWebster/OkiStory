import NextAuth from "next-auth";
import { connectToDb } from "@/services/database/database";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import {
    type NextAuthOptions,
    type DefaultSession,
} from "next-auth";
import { Users, UsersAttributes } from "@/services/database/models/Users";
import { verifyUserProvider } from "@/services/users";
import GoogleProvider from "next-auth/providers/google";
import { PaidAccounts, PaidAccountsAttributes } from "@/services/database/models/PaidAccounts";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            internalUser: UsersAttributes;
            paidAccount: PaidAccountsAttributes;
        } & DefaultSession["user"];
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXT_AUTH_SECRET!,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ profile }) {
            try {
                await verifyUserProvider(profile);
                return true;
            } catch (error) {
                console.error(`Error in signIn callback; profile: ${JSON.stringify(profile)}, error: ${JSON.stringify(profile)}`);
                throw new Error("identity_provider_mismatch");
            }
        },
        async session({ session }) {
            try {
                if (session.user?.email) {
                    connectToDb();
                    const user = await Users.getUserByEmail(session.user.email);
                    const paidAccount = await PaidAccounts.getPaidAccountByUserID(user.id!);
                    session.user.id = user.id!.toString();
                    session.user.internalUser = user;
                    session.user.paidAccount = paidAccount;
                }
                return session;
            } catch (error) {
                console.error(`Error in session callback; session: ${JSON.stringify(session)} ${JSON.stringify(error)}`)
                throw error;
            }
        },
    },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (req: NextApiRequest, res: NextApiResponse) => {
    return getServerSession(req, res, authOptions);
};

export default NextAuth(authOptions);