import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login, validateToken } from "@/common/services/authService";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await login(email, password);

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          accessToken: user.accessToken,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, persist the API access token
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.tokenValid = true;
        return token;
      }

      // On every subsequent request, re-validate the token with the backend
      if (token.accessToken) {
        token.tokenValid = await validateToken(token.accessToken);
      } else {
        token.tokenValid = false;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
      }
      session.tokenValid = token.tokenValid ?? false;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
