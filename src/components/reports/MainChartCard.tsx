"use client";

import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import ChartControls, {
    type ChartType,
    type PeriodType,
} from "./ChartControls";
import ChartRenderer, {
    type MonthData,
    type CategoryData,
} from "./ChartRenderer";
import { IconBarChart } from "@/components/icons";
import { iconTokens } from "@/styles/design-tokens";

interface MainChartCardProps {
    chartType: ChartType;
    period: PeriodType;
    monthlyData: MonthData[];
    categoryData: CategoryData[];
    loading: boolean;
    onChartTypeChange: (t: ChartType) => void;
    onPeriodChange: (p: PeriodType) => void;
}

export default function MainChartCard({
    chartType,
    period,
    monthlyData,
    categoryData,
    loading,
    onChartTypeChange,
    onPeriodChange,
}: MainChartCardProps) {
    return (
        <Card
            variant="glass"
            accentBar="brand"
            className="animate-fade-in delay-75"
            style={{ marginBottom: "clamp(.5rem, 2vw, 1rem)" }}
        >
            <ChartControls
                chartType={chartType}
                period={period}
                onChartTypeChange={onChartTypeChange}
                onPeriodChange={onPeriodChange}
            />
            <SectionHeader
                title={
                    chartType === "pie"
                        ? "Gastos por categoria"
                        : "Receitas vs Gastos"
                }
                icon={<IconBarChart size={12} />}
                {...iconTokens.brand}
            />
            <ChartRenderer
                chartType={chartType}
                monthlyData={monthlyData}
                categoryData={categoryData}
                loading={loading}
            />
        </Card>
    );
}
