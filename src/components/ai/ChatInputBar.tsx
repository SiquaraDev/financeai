"use client";

import React, { useRef } from "react";
import Button from "@/components/ui/Button";
import { IconSend } from "@/components/icons";

interface ChatInputBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    loading?: boolean;
    placeholder?: string;
    maxHeight?: number;
}

export default function ChatInputBar({
    value,
    onChange,
    onSubmit,
    disabled = false,
    loading = false,
    placeholder = "Digite uma mensagem…",
    maxHeight = 120,
}: ChatInputBarProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    // Focus ring lives on the wrapper, not the textarea
    const handleFocus = () => {
        if (!wrapperRef.current) return;
        wrapperRef.current.style.borderColor = "var(--brand-500)";
        wrapperRef.current.style.boxShadow =
            "0 0 0 3px var(--accent-brand-glow)";
    };

    const handleBlur = () => {
        if (!wrapperRef.current) return;
        wrapperRef.current.style.borderColor = "var(--border)";
        wrapperRef.current.style.boxShadow = "none";
    };

    const canSubmit = !disabled && !loading && value.trim().length > 0;

    return (
        <div
            style={{
                padding: "clamp(.625rem,2vw,1rem) clamp(.75rem,2vw,1.25rem) 0",
                borderTop: "1px solid var(--border-subtle)",
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "var(--space-2)",
                    alignItems: "flex-end",
                }}
            >
                <div
                    ref={wrapperRef}
                    style={{
                        flex: 1,
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        background: "var(--bg-elevated)",
                        overflow: "hidden",
                        transition:
                            "border-color var(--transition-base), box-shadow var(--transition-base)",
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={disabled || loading}
                        rows={1}
                        style={{
                            display: "block",
                            width: "100%",
                            resize: "none",
                            minHeight: "42px",
                            maxHeight: `${maxHeight}px`,
                            lineHeight: "1.5",
                            overflowY: "auto",
                            padding: "10px 14px",
                            border: "none",
                            borderRadius: 0,
                            background: "transparent",
                            outline: "none",
                            boxShadow: "none",
                            fontFamily: "var(--font-body)",
                            fontSize: "var(--text-sm)",
                            color: "var(--text-primary)",
                        }}
                    />
                </div>

                <Button
                    variant="primary"
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    loading={loading}
                    icon={!loading ? <IconSend size={14} /> : undefined}
                    style={{
                        padding: "10px 14px",
                        flexShrink: 0,
                        opacity: canSubmit ? 1 : 0.45,
                        minWidth: "44px",
                    }}
                />
            </div>

            <p
                style={{
                    fontSize: "10px",
                    color: "var(--text-dim)",
                    marginTop: "var(--space-1)",
                    textAlign: "center",
                    paddingBottom: "clamp(.625rem,2vw,1rem)",
                }}
            >
                Enter para enviar · Shift+Enter para nova linha
            </p>
        </div>
    );
}
