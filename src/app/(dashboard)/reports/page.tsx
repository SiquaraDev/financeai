"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

type ChartType = "bar" | "line" | "pie" | "area" | "scatter";
type PeriodType = "monthly" | "quarterly" | "yearly";

const COLORS = ["#378ADD", "#1D9E75", "#EF9F27", "#D4537E", "#7F77DD", "#D85A30"];

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

interface MonthData {
  month: string;
  receitas: number;
  gastos: number;
  saldo: number;
}

interface CategoryData {
  name: string;
  value: number;
}

export default function ReportsPage() {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [period, setPeriod] = useState<PeriodType>("monthly");
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const months = period === "monthly" ? 6 : period === "quarterly" ? 12 : 24;
    const results: MonthData[] = [];
    const catMap: Record<string, number> = {};

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date).toISOString();
      const end = endOfMonth(date).toISOString();
      const res = await fetch(`/api/transactions?limit=200&start=${start}&end=${end}`);
      const data = await res.json();
      const txs = data.transactions ?? [];

      const income = txs.filter((t: { type: string }) => t.type === "INCOME").reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0);
      const expense = txs.filter((t: { type: string }) => t.type === "EXPENSE").reduce((s: number, t: { amount: number }) => s + Number(t.amount), 0);

      results.push({
        month: format(date, period === "monthly" ? "MMM/yy" : "MM/yyyy", { locale: ptBR }),
        receitas: Math.round(income),
        gastos: Math.round(expense),
        saldo: Math.round(income - expense),
      });

      txs.filter((t: { type: string }) => t.type === "EXPENSE").forEach((t: { category: string; amount: number }) => {
        catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
      });
    }

    setMonthlyData(results);
    setCategoryData(
      Object.entries(catMap)
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
    );
    setLoading(false);
  }, [period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const chartTypes: { type: ChartType; label: string }[] = [
    { type: "bar", label: "Barras" },
    { type: "line", label: "Linhas" },
    { type: "pie", label: "Pizza" },
    { type: "area", label: "Área" },
    { type: "scatter", label: "Dispersão" },
  ];

  const renderChart = () => {
    if (loading) return <div className="flex items-center justify-center h-64 text-sm text-gray-400">Carregando...</div>;

    const commonProps = {
      data: chartType === "pie" ? categoryData : monthlyData,
    };

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "scatter") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="gastos" name="Gastos" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <YAxis dataKey="receitas" name="Receitas" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: number) => formatCurrency(v)} />
            <Scatter data={monthlyData} fill="#378ADD" />
          </ScatterChart>
        </ResponsiveContainer>
      );
    }

    const ChartComponent = chartType === "bar" ? BarChart : chartType === "line" ? LineChart : AreaChart;
    const DataComponent = chartType === "bar" ? Bar : chartType === "line" ? Line : Area;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => formatCurrency(v)} />
          <Legend />
          {chartType === "area" ? (
            <>
              <Area type="monotone" dataKey="receitas" stroke="#1D9E75" fill="#E1F5EE" name="Receitas" />
              <Area type="monotone" dataKey="gastos" stroke="#E24B4A" fill="#FCEBEB" name="Gastos" />
            </>
          ) : chartType === "line" ? (
            <>
              <Line type="monotone" dataKey="receitas" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} name="Receitas" />
              <Line type="monotone" dataKey="gastos" stroke="#E24B4A" strokeWidth={2} dot={{ r: 3 }} name="Gastos" />
              <Line type="monotone" dataKey="saldo" stroke="#378ADD" strokeWidth={2} strokeDasharray="5 5" name="Saldo" />
            </>
          ) : (
            <>
              <Bar dataKey="receitas" fill="#1D9E75" name="Receitas" radius={[3, 3, 0, 0]} />
              <Bar dataKey="gastos" fill="#E24B4A" name="Gastos" radius={[3, 3, 0, 0]} />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500">Visualize seus dados financeiros</p>
      </div>

      {/* Tipo de gráfico */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">Tipo de gráfico</p>
            <div className="flex gap-2 flex-wrap">
              {chartTypes.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    chartType === type
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Período</p>
            <div className="flex gap-2">
              {([
                { v: "monthly", l: "6 meses" },
                { v: "quarterly", l: "12 meses" },
                { v: "yearly", l: "2 anos" },
              ] as const).map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => setPeriod(v)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    period === v
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          {chartType === "pie" ? "Gastos por categoria" : "Receitas vs Gastos"}
        </h2>
        {renderChart()}
      </div>

      {/* Segundo gráfico: evolução do saldo */}
      {chartType !== "pie" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Evolução do saldo</h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">Carregando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area
                  type="monotone"
                  dataKey="saldo"
                  stroke="#378ADD"
                  fill="#E6F1FB"
                  name="Saldo"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Pizza de categorias sempre disponível */}
      {chartType !== "pie" && categoryData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Gastos por categoria (período)</h2>
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center gap-2">
              {categoryData.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-gray-600 flex-1">{cat.name}</span>
                  <span className="text-xs font-medium text-gray-900">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
