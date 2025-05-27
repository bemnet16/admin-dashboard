import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      id: "google",
      name: "google",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch("http://localhost:3005/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
          const user = await res.json();
         
          if (res.ok && user) {
            try {
              const userRes = await fetch(`http://localhost:3005/auth/profile`, {
                headers: {
                  Authorization: `Bearer ${user.accessToken}`,
                },
              });
              if (userRes.ok) {
                const userData = await userRes.json();
                return {
                  ...userData,
                  accessToken: user.accessToken
                };
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          } else {
            return null;
          }
        } catch (error) {
          return { error, message: "Error logging in" };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.bio = user.bio;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.bio = token.bio;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
});
