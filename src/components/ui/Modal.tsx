"use client";

import React, { useEffect } from "react";
import Card from "./Card";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    maxWidth?: string | number;
    accentBar?: "brand" | "success" | "teal" | "none";
    ariaLabel?: string;
}

export default function Modal({
    children,
    onClose,
    maxWidth = 440,
    accentBar = "brand",
    ariaLabel = "Dialog",
}: ModalProps) {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            style={{
                position: "fixed",
                inset: 0,
                background: "var(--bg-overlay)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                padding: "1rem",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <Card
                variant="elevated"
                accentBar={accentBar}
                padding="clamp(1.25rem, 4vw, 1.75rem)"
                className="animate-fade-in-scale"
                style={{
                    width: "100%",
                    maxWidth,
                }}
            >
                {children}
            </Card>
        </div>
    );
}
