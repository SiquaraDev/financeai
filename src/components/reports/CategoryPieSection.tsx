"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import type { CategoryData } from "./ChartRenderer";

const COLORS = [
    "#378ADD",
    "#1D9E75",
    "#EF9F27",
    "#D4537E",
    "#7F77DD",
    "#D85A30",
];

const TOOLTIP_STYLE: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-lg)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontFamily: "var(--font-body)",
};

export default function CategoryPieSection({ data }: { data: CategoryData[] }) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-4)",
                alignItems: "center",
            }}
        >
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={TOOLTIP_STYLE}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                }}
            >
                {data.map((cat, i) => (
                    <div
                        key={cat.name}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-2)",
                            padding: "var(--space-1) var(--space-2)",
                            borderRadius: "var(--radius-md)",
                            transition: "background var(--transition-base)",
                            minWidth: 0,
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                                "var(--bg-elevated)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                        }
                    >
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "var(--radius-full)",
                                flexShrink: 0,
                                background: COLORS[i % COLORS.length],
                            }}
                        />
                        <span
                            style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--text-secondary)",
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minWidth: 0,
                            }}
                        >
                            {cat.name}
                        </span>
                        <span
                            className="font-mono"
                            style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: 600,
                                color: COLORS[i % COLORS.length],
                                flexShrink: 0,
                            }}
                        >
                            {formatCurrency(cat.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
