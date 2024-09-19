import NextAuth from 'next-auth/next';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

// Check for required environment variables
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (
  !githubClientId ||
  !githubClientSecret ||
  !googleClientId ||
  !googleClientSecret
) {
  throw new Error('Missing OAuth environment variables');
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = { ...session.user, id: String(token.id) };
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (!account) {
        throw new Error('Missing account');
      }
      const email = user.email;
      const provider = account.provider;
      const providerAccountId = account?.id;
      const accountType = account?.type || 'oauth'; // Default type to "oauth" for GitHub/Google

      if (!email) {
        console.error('Email is missing in OAuth profile');
        return false; // Prevent sign-in instead of throwing an error
      }

      const providerStr = provider ? String(provider) : '';
      const providerAccountIdStr = providerAccountId
        ? String(providerAccountId)
        : '';

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (!existingUser) {
        // Create a new user and account
        await prisma.user.create({
          data: {
            email,
            name: user.name || '',
            image: user.image || '',
            accounts: {
              create: {
                provider: providerStr,
                providerAccountId: providerAccountIdStr,
                type: accountType,
              },
            },
          },
        });
      } else {
        // Upsert the account for the existing user
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: providerStr,
              providerAccountId: providerAccountIdStr,
            },
          },
          update: {
            access_token: account.access_token, // Map to the correct field name
            refresh_token: account.refresh_token, // Map to the correct field name
            token_type: account.token_type,
            expires_at: account.expires_at,
            id_token: account.id_token,
            accessTokenExpires: account.expires_at // Ensure this matches your schema
              ? new Date(account.expires_at * 1000)
              : null, // Use a proper date if it exists
          },
          create: {
            provider: providerStr,
            providerAccountId: providerAccountIdStr,
            type: accountType,
            userId: existingUser.id,
            access_token: account.access_token, // Map to the correct field name
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            id_token: account.id_token,
            token_type: account.token_type, // Optional, map to your schema
            scope: account.scope, // Optional
            accessTokenExpires: account?.expires_at // Ensure this matches your schema
              ? new Date(account.expires_at * 1000) // Convert Unix timestamp to Date object
              : null, // Use a proper date if it exists
          },
        });
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
