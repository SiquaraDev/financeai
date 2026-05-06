"use client";

import { useRef } from "react";
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

    const canSubmit = !disabled && !loading && value.trim().length > 0;

    return (
        <div className="chat-input-bar">
            <div className="chat-input-bar__row">
                <div className="chat-input-bar__field">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled || loading}
                        rows={1}
                        className="chat-input-bar__textarea"
                        style={{ maxHeight: `${maxHeight}px` }}
                    />
                </div>
                <Button
                    variant="primary"
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    loading={loading}
                    icon={!loading ? <IconSend size={14} /> : undefined}
                    style={{ opacity: canSubmit ? 1 : 0.45 }}
                    className="chat-input-bar__send"
                />
            </div>
            <p className="chat-input-bar__hint">
                Enter para enviar · Shift+Enter para nova linha
            </p>
        </div>
    );
}
