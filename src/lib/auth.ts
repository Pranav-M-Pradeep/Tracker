import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

function generateToken() {
  // Safe across all environments (Node.js, Edge, Vercel)
  const arr = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    // Node.js fallback
    const { randomFillSync } = require("crypto");
    randomFillSync(arr);
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        const userAgent =
          (req as any)?.headers?.["user-agent"] || "Unknown Device";
        const sessionToken = generateToken();

        const activeSessions = await prisma.session.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "asc" },
        });

        if (activeSessions.length >= 3) {
          await prisma.session.delete({
            where: { id: activeSessions[0].id },
          });
        }

        await prisma.session.create({
          data: {
            userId: user.id,
            sessionToken,
            deviceInfo: userAgent,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          sessionToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sessionToken = (user as any).sessionToken;
      }

      if (token.sessionToken) {
        const dbSession = await prisma.session.findUnique({
          where: { sessionToken: token.sessionToken as string },
        });

        if (!dbSession) {
          token.error = "SessionRevoked";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.error) {
        (session as any).error = token.error;
      }
      return session;
    },
  },
};
