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
  callbacks: {
    async jwt({ token }:any) {
      const userDb = async () => {
        try {
          return await prisma.user.findFirst({
            where: {
              email: token.email,
            },
          });
        } catch (error) {
          console.error(error);
        } finally {
          await prisma.$disconnect();
        }
      };
      const dbUser = await userDb();
      if (!dbUser) {
        return null;
      }
      token.id = dbUser.id;
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.image = dbUser.image;
      return token;
    },
    async session({ session, token }:any) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.image;
      return session;
    },
  },session:{
    strategy:"jwt"
  }
};
const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };