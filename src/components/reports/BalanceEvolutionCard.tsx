/**
 * BalanceEvolutionCard
 *
 * Displays an AreaChart of the monthly balance evolution.
 * Receives pre-computed data so the chart has zero fetching logic.
 */

"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { IconActivity } from "@/components/icons";
import { formatCurrency, formatCurrencyCompact } from "@/lib/formatters";
import type { MonthData } from "./ChartRenderer";

const TOOLTIP_STYLE: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-lg)",
  color: "var(--text-primary)",
  fontSize: "13px",
  fontFamily: "var(--font-body)",
};

const AXIS_TICK = {
  fill: "var(--text-muted)",
  fontSize: 11,
  fontFamily: "var(--font-mono)",
};

interface BalanceEvolutionCardProps {
  data: MonthData[];
  loading: boolean;
}

export default function BalanceEvolutionCard({
  data,
  loading,
}: BalanceEvolutionCardProps) {
  return (
    <Card
      variant="glass"
      className="animate-fade-in delay-150"
      style={{ marginBottom: "clamp(.5rem, 2vw, 1rem)" }}
    >
      <SectionHeader
        title="Evolução do saldo"
        icon={<IconActivity size={12} />}
        iconBg="var(--accent-teal-glow)"
        iconBorder="rgba(20,184,166,.25)"
        iconColor="var(--accent-teal-light)"
      />
      {loading ? (
        <LoadingSpinner height={200} />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
            <XAxis dataKey="month" tick={AXIS_TICK} />
            <YAxis tickFormatter={formatCurrencyCompact} tick={AXIS_TICK} />
            <Tooltip
              formatter={(v: number) => formatCurrency(v)}
              contentStyle={TOOLTIP_STYLE}
            />
            <Area
              type="monotone"
              dataKey="saldo"
              stroke="var(--accent-brand-light)"
              fill="var(--accent-brand-glow)"
              name="Saldo"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
