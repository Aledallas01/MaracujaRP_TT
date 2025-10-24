import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discordId: string;
    } & DefaultSession["user"];
    accessToken?: string;
    hasAdminRole?: boolean;
  }

  interface User extends DefaultUser {
    id: string;
    discordId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    discordId?: string;
    hasAdminRole?: boolean;
  }
}
