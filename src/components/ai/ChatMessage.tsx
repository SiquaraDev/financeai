import { GeminiIcon } from "@/components/icons";
import type { ChatMessage as ChatMessageData } from "@/types";

type ChatMessageProps = ChatMessageData;

export default function ChatMessage({ role, content }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div
            className="animate-fade-in"
            style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                gap: "var(--space-2)",
                alignItems: "flex-end",
            }}
        >
            {!isUser && (
                <div
                    style={{
                        width: "26px",
                        height: "26px",
                        flexShrink: 0,
                        borderRadius: "var(--radius-full)",
                        background: "var(--accent-teal-glow)",
                        border: "1px solid rgba(20,184,166,.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent-teal-light)",
                    }}
                >
                    <GeminiIcon size={12} />
                </div>
            )}

            <div
                style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    borderRadius: isUser
                        ? "var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)"
                        : "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
                    background: isUser
                        ? "var(--gradient-brand)"
                        : "var(--bg-elevated)",
                    border: isUser ? "none" : "1px solid var(--border-subtle)",
                    boxShadow: isUser
                        ? "var(--shadow-brand)"
                        : "var(--shadow-sm)",
                    fontSize: "var(--text-sm)",
                    color: isUser
                        ? "var(--text-on-brand)"
                        : "var(--text-secondary)",
                    lineHeight: 1.65,
                    wordBreak: "break-word",
                }}
            >
                {content}
            </div>

            {isUser && (
                <div
                    style={{
                        width: "26px",
                        height: "26px",
                        flexShrink: 0,
                        borderRadius: "var(--radius-full)",
                        background: "var(--gradient-brand)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "white",
                        fontFamily: "var(--font-display)",
                    }}
                >
                    U
                </div>
            )}
        </div>
    );
}
