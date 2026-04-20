"use client";

import { signIn } from "next-auth/react";
import { GoogleLogo } from "@/components/icons";

export default function GoogleSignInButton() {
    return (
        <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="btn-ghost"
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "11px var(--space-5)",
                fontSize: "var(--text-sm)",
                borderRadius: "var(--radius-md)",
            }}
        >
            <GoogleLogo />
            Continuar com Google
        </button>
    );
}
