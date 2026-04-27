import { Syne, DM_Sans, DM_Mono } from "next/font/google";

export const syne = Syne({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-display",
    display: "swap",
});

export const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-body",
    display: "swap",
});

export const dmMono = DM_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono",
    display: "swap",
});

export const fontVariables = `${syne.variable} ${dmSans.variable} ${dmMono.variable}`;
