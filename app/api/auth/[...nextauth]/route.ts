import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "test-secret-temporary-123456789012345",
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/error",
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "identify email",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // Saat login pertama
      if (account && profile) {
        const discordProfile = profile as any;

        token.id = discordProfile.id;
        token.username = discordProfile.username;
        token.discriminator = discordProfile.discriminator;
        token.avatar = discordProfile.avatar;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.discriminator = token.discriminator as string;
        session.user.avatar = token.avatar as string;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
