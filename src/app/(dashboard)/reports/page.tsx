"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import MainChartCard from "@/components/reports/MainChartCard";
import BalanceEvolutionCard from "@/components/reports/BalanceEvolutionCard";
import CategoryBreakdownCard from "@/components/reports/CategoryBreakdownCard";
import { useReportsData } from "@/hooks/useReportsData";
import type { ChartType } from "@/components/reports/ChartControls";
import type { PeriodType } from "@/components/reports/ChartControls";

export default function ReportsPage() {
    const [chartType, setChartType] = useState<ChartType>("bar");
    const [period, setPeriod] = useState<PeriodType>("monthly");

    const { monthlyData, categoryData, loading } = useReportsData(period);

    const isPieChart = chartType === "pie";

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

            {!isPieChart && (
                <BalanceEvolutionCard data={monthlyData} loading={loading} />
            )}

            {!isPieChart && <CategoryBreakdownCard data={categoryData} />}
        </div>
    );
}
