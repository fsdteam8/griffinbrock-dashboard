import { DefaultSession, User as DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken?: string;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      accessToken?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken?: string;
    role?: string;
  }
}