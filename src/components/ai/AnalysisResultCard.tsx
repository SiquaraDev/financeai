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
        <div className="analysis-result-card card-glass animate-fade-in">
            <div className="analysis-result-card__accent" />
            <div className="analysis-result-card__header">
                <span className="analysis-result-card__icon">
                    <IconLightbulb size={13} />
                </span>
                <h2 className="analysis-result-card__title font-display">
                    Dicas personalizadas
                </h2>
            </div>
            <div className="analysis-result-card__list">
                {analysis.tips.map((tip, i) => {
                    const s = TIP_STYLES[i % TIP_STYLES.length];
                    return (
                        <div
                            key={i}
                            className="analysis-result-card__tip"
                            style={{
                                background: s.bg,
                                border: `1px solid ${s.border}`,
                            }}
                        >
                            <span
                                className="analysis-result-card__tip-icon"
                                style={{ color: s.color }}
                            >
                                ✦
                            </span>
                            <div className="analysis-result-card__tip-content">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => (
                                            <p className="analysis-result-card__tip-p">
                                                {children}
                                            </p>
                                        ),
                                        strong: ({ children }) => (
                                            <strong className="analysis-result-card__tip-strong">
                                                {children}
                                            </strong>
                                        ),
                                        em: ({ children }) => (
                                            <em style={{ fontStyle: "italic" }}>
                                                {children}
                                            </em>
                                        ),
                                        ul: ({ children }) => (
                                            <ul className="analysis-result-card__tip-ul">
                                                {children}
                                            </ul>
                                        ),
                                        ol: ({ children }) => (
                                            <ol className="analysis-result-card__tip-ol">
                                                {children}
                                            </ol>
                                        ),
                                        li: ({ children }) => (
                                            <li className="analysis-result-card__tip-li">
                                                {children}
                                            </li>
                                        ),
                                        table: ({ children }) => (
                                            <div className="analysis-result-card__tip-table-wrapper">
                                                <table className="analysis-result-card__tip-table">
                                                    {children}
                                                </table>
                                            </div>
                                        ),
                                        thead: ({ children }) => (
                                            <thead className="analysis-result-card__tip-thead">
                                                {children}
                                            </thead>
                                        ),
                                        tbody: ({ children }) => (
                                            <tbody>{children}</tbody>
                                        ),
                                        tr: ({ children }) => (
                                            <tr className="analysis-result-card__tip-tr">
                                                {children}
                                            </tr>
                                        ),
                                        th: ({ children }) => (
                                            <th className="analysis-result-card__tip-th">
                                                {children}
                                            </th>
                                        ),
                                        td: ({ children }) => (
                                            <td className="analysis-result-card__tip-td">
                                                {children}
                                            </td>
                                        ),
                                        code: ({ children, style: s2 }) => (
                                            <code
                                                className="analysis-result-card__tip-code"
                                                style={s2}
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
    );
}
