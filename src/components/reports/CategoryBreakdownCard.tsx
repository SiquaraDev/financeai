"use client";

import React from "react";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryPieSection from "./CategoryPieSection";
import { IconPieChart } from "@/components/icons";
import type { CategoryData } from "./ChartRenderer";

interface CategoryBreakdownCardProps {
    data: CategoryData[];
}

export default function CategoryBreakdownCard({
    data,
}: CategoryBreakdownCardProps) {
    if (data.length === 0) return null;

    return (
        <Card
            variant="glass"
            className="animate-fade-in delay-225"
            style={{ overflow: "hidden" }}
        >
            <SectionHeader
                title="Gastos por categoria (período)"
                icon={<IconPieChart size={12} />}
                iconBg="var(--color-warning-bg)"
                iconBorder="var(--color-warning-border)"
                iconColor="var(--color-warning-light)"
            />
            <div
                className="reports-cat-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "var(--space-4)",
                    alignItems: "center",
                }}
            >
                <CategoryPieSection data={data} />
            </div>
        </Card>
    );
}
