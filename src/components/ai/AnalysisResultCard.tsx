import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AnalysisResult } from "@/types";
import { IconLightbulb } from "@/components/icons";

const TIP_STYLES = [
    {
        bg: "var(--color-success-bg)",
        border: "var(--color-success-border)",
        color: "var(--color-success-light)",
    },
    {
        bg: "var(--accent-brand-glow)",
        border: "var(--border-glow)",
        color: "var(--accent-brand-light)",
    },
    {
        bg: "var(--color-warning-bg)",
        border: "var(--color-warning-border)",
        color: "var(--color-warning-light)",
    },
    {
        bg: "var(--accent-teal-glow)",
        border: "rgba(20,184,166,.22)",
        color: "var(--accent-teal-light)",
    },
];

export default function AnalysisResultCard({
    analysis,
}: {
    analysis: AnalysisResult;
}) {
    return (
        <div
            className="card-glass animate-fade-in"
            style={{
                overflowY: "hidden",
                borderRadius: "var(--radius-xl)",
                flexShrink: 0,
            }}
        >
            <div
                style={{ height: "3px", background: "var(--gradient-success)" }}
            />
            <div
                style={{
                    paddingInline: "clamp(.875rem,3vw,1.25rem)",
                    paddingBottom: "clamp(.875rem,3vw,1.25rem)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".5rem",
                        margin: ".875rem 0",
                    }}
                >
                    <span
                        style={{
                            width: "26px",
                            height: "26px",
                            flexShrink: 0,
                            borderRadius: "var(--radius-md)",
                            background: "var(--color-warning-bg)",
                            border: "1px solid var(--color-warning-border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--color-warning-light)",
                        }}
                    >
                        <IconLightbulb size={13} />
                    </span>
                    <h2
                        className="font-display"
                        style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Dicas personalizadas
                    </h2>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-2)",
                    }}
                >
                    {analysis.tips.map((tip, i) => {
                        const s = TIP_STYLES[i % TIP_STYLES.length];
                        return (
                            <div
                                key={i}
                                style={{
                                    background: s.bg,
                                    border: `1px solid ${s.border}`,
                                    borderRadius: "var(--radius-md)",
                                    padding: "8px 12px",
                                    display: "flex",
                                    gap: "var(--space-2)",
                                    alignItems: "flex-start",
                                    overflowX: "auto",
                                }}
                            >
                                <span
                                    style={{
                                        color: s.color,
                                        fontSize: "10px",
                                        marginTop: "3px",
                                        flexShrink: 0,
                                    }}
                                >
                                    ✦
                                </span>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ children }) => (
                                                <p
                                                    style={{
                                                        margin: "0 0 0.4rem",
                                                        fontSize:
                                                            "var(--text-xs)",
                                                        color: "var(--text-secondary)",
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {children}
                                                </p>
                                            ),
                                            strong: ({ children }) => (
                                                <strong
                                                    style={{
                                                        fontWeight: 600,
                                                        color: "var(--text-primary)",
                                                    }}
                                                >
                                                    {children}
                                                </strong>
                                            ),
                                            em: ({ children }) => (
                                                <em
                                                    style={{
                                                        fontStyle: "italic",
                                                    }}
                                                >
                                                    {children}
                                                </em>
                                            ),
                                            ul: ({ children }) => (
                                                <ul
                                                    style={{
                                                        paddingLeft: "1.1rem",
                                                        margin: "0.2rem 0",
                                                    }}
                                                >
                                                    {children}
                                                </ul>
                                            ),
                                            ol: ({ children }) => (
                                                <ol
                                                    style={{
                                                        paddingLeft: "1.1rem",
                                                        margin: "0.2rem 0",
                                                    }}
                                                >
                                                    {children}
                                                </ol>
                                            ),
                                            li: ({ children }) => (
                                                <li
                                                    style={{
                                                        margin: "0.15rem 0",
                                                        fontSize:
                                                            "var(--text-xs)",
                                                        color: "var(--text-secondary)",
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {children}
                                                </li>
                                            ),
                                            table: ({ children }) => (
                                                <div
                                                    style={{
                                                        overflowX: "auto",
                                                        margin: "0.4rem 0",
                                                        borderRadius:
                                                            "var(--radius-sm)",
                                                        border: "1px solid var(--border-subtle)",
                                                    }}
                                                >
                                                    <table
                                                        style={{
                                                            width: "100%",
                                                            borderCollapse:
                                                                "collapse",
                                                            fontSize:
                                                                "var(--text-xs)",
                                                        }}
                                                    >
                                                        {children}
                                                    </table>
                                                </div>
                                            ),
                                            thead: ({ children }) => (
                                                <thead
                                                    style={{
                                                        background:
                                                            "var(--bg-elevated)",
                                                    }}
                                                >
                                                    {children}
                                                </thead>
                                            ),
                                            tbody: ({ children }) => (
                                                <tbody>{children}</tbody>
                                            ),
                                            tr: ({ children }) => (
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid var(--border-subtle)",
                                                    }}
                                                >
                                                    {children}
                                                </tr>
                                            ),
                                            th: ({ children }) => (
                                                <th
                                                    style={{
                                                        padding: "5px 8px",
                                                        textAlign: "left",
                                                        fontWeight: 600,
                                                        color: "var(--text-primary)",
                                                        whiteSpace: "nowrap",
                                                        fontSize:
                                                            "var(--text-xs)",
                                                    }}
                                                >
                                                    {children}
                                                </th>
                                            ),
                                            td: ({ children }) => (
                                                <td
                                                    style={{
                                                        padding: "5px 8px",
                                                        color: "var(--text-secondary)",
                                                        verticalAlign: "top",
                                                        fontSize:
                                                            "var(--text-xs)",
                                                    }}
                                                >
                                                    {children}
                                                </td>
                                            ),
                                            code: ({ children }) => (
                                                <code
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-mono)",
                                                        fontSize: "0.7rem",
                                                        background:
                                                            "var(--bg-elevated)",
                                                        borderRadius:
                                                            "var(--radius-sm)",
                                                        padding: "1px 5px",
                                                        color: s.color,
                                                    }}
                                                >
                                                    {children}
                                                </code>
                                            ),
                                        }}
                                    >
                                        {tip}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
