// app/posts/create/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientComponent from "./ClientComponent";

export default async function CreatePostPage() {
    const session = await getServerSession(authOptions);

    // Server-side redirect if not owner
    if (!session?.user || session.user.role !== "owner") {
        redirect("/unauthorized");
    }

    return <ClientComponent />;
}