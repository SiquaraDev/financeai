"use client";

import { useSession } from "next-auth/react";
import { getInitials } from "@/utils";
import { UserContext } from "@/context/UserContext";

export default function UserProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();

    const value = {
        name: session?.user?.name ?? null,
        email: session?.user?.email ?? null,
        initials: getInitials(session?.user?.name),
        image: session?.user?.image ?? null,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
