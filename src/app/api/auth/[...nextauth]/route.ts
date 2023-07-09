import NextAuth ,{type NextAuthOptions}from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { envVariables } from "@/lib/env";

export const authOptions:NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId:envVariables.GITHUB_CLIENT_ID,
      clientSecret:envVariables.GITHUB_CLIENT_SECRET,   
    }),
  ],
  session:{
    strategy:"jwt"
  }
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };