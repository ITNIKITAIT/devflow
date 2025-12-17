import { PrismaAdapter } from '@auth/prisma-adapter';
import { redirect } from 'next/navigation';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import { prisma } from './db';

export const { handlers, signIn, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'read:user user:email repo',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const account = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: 'github',
        },
      });
      if (session.user) {
        (session.user as any).githubId = (account as any)?.providerAccountId;
        (session.user as any).username = (user as any).name;
        (session.user as any).accessToken = account?.access_token;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export async function requireAuth() {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }
  return session;
}
