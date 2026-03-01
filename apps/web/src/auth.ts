import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@ori-os/db"

const prisma = new PrismaClient()

const nextAuth = NextAuth({
    adapter: PrismaAdapter(prisma as any),
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Real auth logic should use database and bcrypt comparison
                // The API handles the core auth, Web uses this for NextAuth session

                // For development, if ORI_AUTH_BYPASS is on, this is handled in callbacks
                // But we should not have hardcoded admin/password here.
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isAuthBypass = process.env.ORI_AUTH_BYPASS === "1" || process.env.AUTH_BYPASS === "true";
            if (isAuthBypass) return true;

            const isLoggedIn = !!auth?.user
            const isDashboard = nextUrl.pathname.startsWith("/dashboard")
            if (isDashboard) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }
            return true
        },
        async session({ session, token }) {
            const isAuthBypass = process.env.ORI_AUTH_BYPASS === "1" || process.env.AUTH_BYPASS === "true";
            if (isAuthBypass) {
                session.user = {
                    id: "dev",
                    name: "Developer",
                    email: "dev@ori-os.com",
                    image: null
                } as any;
            }
            return session;
        },
        async jwt({ token, user }) {
            const isAuthBypass = process.env.ORI_AUTH_BYPASS === "1" || process.env.AUTH_BYPASS === "true";
            if (isAuthBypass) {
                token.id = "dev";
                token.name = "Developer";
                token.email = "dev@ori-os.com";
            }
            return token;
        }
    },
})


export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth as any;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
