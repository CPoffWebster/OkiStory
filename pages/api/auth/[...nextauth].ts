import NextAuth from "next-auth";
import { connectToDb } from "@/services/database/database";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import {
    type NextAuthOptions,
    type DefaultSession,
} from "next-auth";
import { UsersAttributes } from "@/services/database/models/Users";
import { verifyUserProvider } from "@/services/users";
import GoogleProvider from "next-auth/providers/google";

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
                throw new Error("identity_provider_mismatch");
            }
        },
        async session({ session }) {
            if (session.user?.email) {
                const db = connectToDb();
                const internalUser = await db.tables.Users.findOne({ where: { Email: session.user.email } }) as unknown as UsersAttributes;
                session.user.id = internalUser.id!.toString();
                session.user.internalUser = internalUser;
            }
            return session;
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