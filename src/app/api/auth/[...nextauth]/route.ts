import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Force this route to always be dynamic — never statically generated
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
