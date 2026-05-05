import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IAIcon } from "@/components/icons";

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
    userInitials?: string;
}

export default function ChatMessage({
    role,
    content,
    userInitials = "U",
}: ChatMessageProps) {
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
                    <IAIcon size={12} />
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
                    overflowX: "auto",
                }}
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({ children }) => (
                            <p
                                style={{
                                    margin: "0 0 0.5rem",
                                    color: isUser
                                        ? "var(--text-on-brand)"
                                        : "var(--text-secondary)",
                                }}
                            >
                                {children}
                            </p>
                        ),
                        strong: ({ children }) => (
                            <strong
                                style={{
                                    fontWeight: 600,
                                    color: isUser
                                        ? "white"
                                        : "var(--text-primary)",
                                }}
                            >
                                {children}
                            </strong>
                        ),
                        ul: ({ children }) => (
                            <ul
                                style={{
                                    paddingLeft: "1.25rem",
                                    margin: "0.25rem 0",
                                }}
                            >
                                {children}
                            </ul>
                        ),
                        ol: ({ children }) => (
                            <ol
                                style={{
                                    paddingLeft: "1.25rem",
                                    margin: "0.25rem 0",
                                }}
                            >
                                {children}
                            </ol>
                        ),
                        li: ({ children }) => (
                            <li
                                style={{
                                    margin: "0.2rem 0",
                                    color: isUser
                                        ? "var(--text-on-brand)"
                                        : "var(--text-secondary)",
                                }}
                            >
                                {children}
                            </li>
                        ),
                        h2: ({ children }) => (
                            <h2
                                style={{
                                    fontSize: "var(--text-base)",
                                    fontWeight: 700,
                                    color: isUser
                                        ? "white"
                                        : "var(--text-primary)",
                                    margin: "0.6rem 0 0.3rem",
                                }}
                            >
                                {children}
                            </h2>
                        ),
                        h3: ({ children }) => (
                            <h3
                                style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 700,
                                    color: isUser
                                        ? "white"
                                        : "var(--text-primary)",
                                    margin: "0.5rem 0 0.25rem",
                                }}
                            >
                                {children}
                            </h3>
                        ),
                        table: ({ children }) => (
                            <div
                                style={{
                                    overflowX: "auto",
                                    margin: "0.5rem 0",
                                    borderRadius: "var(--radius-md)",
                                    border: isUser
                                        ? "1px solid rgba(255,255,255,0.2)"
                                        : "1px solid var(--border-subtle)",
                                }}
                            >
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        fontSize: "var(--text-xs)",
                                    }}
                                >
                                    {children}
                                </table>
                            </div>
                        ),
                        thead: ({ children }) => (
                            <thead
                                style={{
                                    background: isUser
                                        ? "rgba(255,255,255,0.15)"
                                        : "var(--bg-card)",
                                }}
                            >
                                {children}
                            </thead>
                        ),
                        tbody: ({ children }) => <tbody>{children}</tbody>,
                        tr: ({ children }) => (
                            <tr
                                style={{
                                    borderBottom: isUser
                                        ? "1px solid rgba(255,255,255,0.1)"
                                        : "1px solid var(--border-subtle)",
                                }}
                            >
                                {children}
                            </tr>
                        ),
                        th: ({ children }) => (
                            <th
                                style={{
                                    padding: "6px 10px",
                                    textAlign: "left",
                                    fontWeight: 600,
                                    color: isUser
                                        ? "white"
                                        : "var(--text-primary)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {children}
                            </th>
                        ),
                        td: ({ children }) => (
                            <td
                                style={{
                                    padding: "6px 10px",
                                    color: isUser
                                        ? "var(--text-on-brand)"
                                        : "var(--text-secondary)",
                                    verticalAlign: "top",
                                }}
                            >
                                {children}
                            </td>
                        ),
                        code: ({ children }) => (
                            <code
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.75em",
                                    background: isUser
                                        ? "rgba(255,255,255,0.15)"
                                        : "var(--bg-card)",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "1px 5px",
                                    color: isUser
                                        ? "white"
                                        : "var(--accent-brand-light)",
                                }}
                            >
                                {children}
                            </code>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote
                                style={{
                                    borderLeft: isUser
                                        ? "3px solid rgba(255,255,255,0.4)"
                                        : "3px solid var(--accent-brand-light)",
                                    paddingLeft: "0.75rem",
                                    margin: "0.4rem 0",
                                    opacity: 0.85,
                                }}
                            >
                                {children}
                            </blockquote>
                        ),
                        hr: () => (
                            <hr
                                style={{
                                    border: "none",
                                    borderTop: isUser
                                        ? "1px solid rgba(255,255,255,0.2)"
                                        : "1px solid var(--border-subtle)",
                                    margin: "0.5rem 0",
                                }}
                            />
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
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
                        lineHeight: 1,
                        textTransform: "uppercase",
                    }}
                >
                    {userInitials}
                </div>
            )}
        </div>
    );
}
