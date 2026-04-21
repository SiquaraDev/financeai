/**
 * DashboardBottomGrid
 *
 * The lower section of the dashboard page containing two cards:
 * 1. Gastos por categoria (CategoryExpenseList)
 * 2. Últimas transações (RecentTransactionsList)
 *
 * Collapses to a single column below 780 px via the shared `.bottom-grid` class.
 */

import React from "react";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryExpenseList from "./CategoryExpenseList";
import RecentTransactionsList from "./RecentTransactionsList";
import { IconPieChart, IconActivity } from "@/components/icons";
import type { DashboardStats } from "@/hooks/useDashboardStats";

interface DashboardBottomGridProps {
  stats: DashboardStats;
}

export default function DashboardBottomGrid({ stats }: DashboardBottomGridProps) {
  return (
    <div className="bottom-grid">
      <Card variant="glass" className="animate-fade-in delay-225">
        <SectionHeader
          title="Gastos por categoria"
          icon={<IconPieChart />}
          iconBg="var(--accent-brand-glow)"
          iconBorder="var(--border-glow)"
          iconColor="var(--accent-brand-light)"
        />
        <CategoryExpenseList
          byCategory={stats.byCategory}
          totalExpense={stats.totalExpense}
        />
      </Card>

      <Card variant="glass" className="animate-fade-in delay-300">
        <SectionHeader
          title="Últimas transações"
          icon={<IconActivity />}
          iconBg="var(--accent-teal-glow)"
          iconBorder="rgba(20,184,166,.25)"
          iconColor="var(--accent-teal-light)"
        />
        <RecentTransactionsList transactions={stats.recent} />
      </Card>
    </div>
  );
}
