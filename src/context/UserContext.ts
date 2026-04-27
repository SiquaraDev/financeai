"use client";

import { createContext, useContext } from "react";

interface UserContextValue {
    name: string | null;
    email: string | null;
    initials: string;
    image?: string | null;
}

const UserContext = createContext<UserContextValue>({
    name: null,
    email: null,
    initials: "U",
    image: null,
});

export function useUser(): UserContextValue {
    return useContext(UserContext);
}

export { UserContext };
