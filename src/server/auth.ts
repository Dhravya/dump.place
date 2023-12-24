import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { env } from "@/env";
import { db } from "@/server/db";

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
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      // from: "Dump.place <dumps@dhr.wtf>",
      async sendVerificationRequest({identifier: email, url}) {
        await fetch("https://worker-email.dhravya.workers.dev/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${env.EMAIL_TOKEN}`,
          },
          body: JSON.stringify({
            "to": email,
            "from": "Dump place <dumps@dhr.wtf>",
            "subject": "Verify your email address.",
            "text": `Welcome to DUMP place. Click here to authenticate: ${url}`,
          }),
        });
      }
    })
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
