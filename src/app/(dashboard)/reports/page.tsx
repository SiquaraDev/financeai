"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import {
    MainChartCard,
    BalanceEvolutionCard,
    CategoryBreakdownCard,
} from "@/components/reports";
import { useReportsData } from "@/hooks";
import type { ChartType, PeriodType } from "@/components/reports";

export default function ReportsPage() {
    const [chartType, setChartType] = useState<ChartType>("bar");
    const [period, setPeriod] = useState<PeriodType>("monthly");
    const { monthlyData, categoryData, loading } = useReportsData(period);

    return (
        <div
            style={{
                padding: "clamp(.75rem, 4vw, 2rem)",
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                boxSizing: "border-box",
            }}
        >
            <PageHeader
                title="Relatórios"
                subtitle="Visualize seus dados financeiros"
            />
            <MainChartCard
                chartType={chartType}
                period={period}
                monthlyData={monthlyData}
                categoryData={categoryData}
                loading={loading}
                onChartTypeChange={setChartType}
                onPeriodChange={setPeriod}
            />
            <BalanceEvolutionCard data={monthlyData} loading={loading} />
            <CategoryBreakdownCard data={categoryData} loading={loading} />{" "}
        </div>
    );
}
