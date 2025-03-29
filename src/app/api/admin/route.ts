import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


export async function GET() {
    const session = await getServerSession(authOptions);

    console.log("Session data:", session); // Debug session data

    if (!session?.user) {
        console.log("No session found"); // Debug no session
        return new Response("Unauthorized: No session found", { status: 401 });
    }

    if (session.user.role as string !== "admin") {
        console.log("Unauthorized access attempt:", session.user); // Debug role mismatch
        return new Response("Unauthorized: Admin access required", { status: 401 });
    }

    return Response.json({ secretData: "Admin only content" });
}