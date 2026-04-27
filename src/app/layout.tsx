import type { Metadata } from "next";
import { fontVariables } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
    title: "FinanceAI — Controle financeiro inteligente",
    description:
        "Gerencie suas finanças com análises inteligentes do Gemini AI",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={fontVariables}>
            <body>{children}</body>
        </html>
    );
}
