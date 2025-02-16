// components/UserBadge.tsx
import { useSession } from "next-auth/react";

export default function UserBadge() {
    const { data: session } = useSession();

    return (
        <div>
            <p>Email: {session?.user?.email}</p>
            <p>Role: {session?.user?.role || 'user'}</p>
        </div>
    );
}