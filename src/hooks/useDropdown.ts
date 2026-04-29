"use client";

import { useState, useRef, useEffect } from "react";

export function useDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggle = () => setIsOpen((v) => !v);
    const close = () => setIsOpen(false);

    return { isOpen, toggle, close, ref };
}
