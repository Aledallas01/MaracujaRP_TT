import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Funzione per controllare il ruolo admin su Discord
async function checkDiscordAdminRole(
  accessToken: string,
  guildId: string,
  adminRoleId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Errore Discord API:",
        response.status,
        response.statusText
      );
      return false;
    }

    const memberData = await response.json();
    const userRoles: string[] = memberData.roles || [];

    return userRoles.includes(adminRoleId);
  } catch (error) {
    console.error("Error checking Discord role:", error);
    return false;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify guilds.members.read" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.discordId = (profile as any).id;

        // Controlla il ruolo admin al login
        const guildId = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID;
        const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;

        if (guildId && adminRoleId && token.accessToken) {
          token.hasAdminRole = await checkDiscordAdminRole(
            token.accessToken,
            guildId,
            adminRoleId
          );
        } else {
          token.hasAdminRole = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.discordId as string;
        session.user.discordId = token.discordId as string;
        session.accessToken = token.accessToken as string;
        session.hasAdminRole = token.hasAdminRole || false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
