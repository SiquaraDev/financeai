"use client";

import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryPieSection from "./CategoryPieSection";
import { IconPieChart } from "@/components/icons";
import { iconTokens } from "@/styles/design-tokens";
import type { CategoryData } from "./ChartRenderer";

export default function CategoryBreakdownCard({
    data,
}: {
    data: CategoryData[];
}) {
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
                {...iconTokens.warning}
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
