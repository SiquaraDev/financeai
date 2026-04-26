"use client";

import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "@/services";
import type { DashboardStats, DateFilterKey } from "@/types";

// DashboardStats lives in @/types — re-exporting it here so existing
// imports like `import type { DashboardStats } from "@/hooks/useDashboardStats"`
// continue to work during migration, but prefer importing from "@/types".
export type { DashboardStats };

interface UseDashboardStatsParams {
    activeFilter: DateFilterKey;
    customStart: string;
    customEnd: string;
}

interface UseDashboardStatsReturn {
    stats: DashboardStats | null;
    loading: boolean;
    refetch: () => void;
}

export function useDashboardStats({
    activeFilter,
    customStart,
    customEnd,
}: UseDashboardStatsParams): UseDashboardStatsReturn {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const data = await dashboardService.fetchStats(
                activeFilter,
                customStart,
                customEnd,
            );
            setStats(data);
        } catch {
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, customStart, customEnd]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, refetch: fetchStats };
}
