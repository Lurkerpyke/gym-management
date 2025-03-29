// app/api/auth/[...nextauth]/route.ts
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// Only export the handlers, remove authOptions export
// Only export the handlers, remove authOptions export
export { handler as GET, handler as POST, authOptions };