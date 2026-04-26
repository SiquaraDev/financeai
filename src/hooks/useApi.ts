"use client";

import { useState, useCallback } from "react";
import type { AsyncState } from "@/types";

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
}

interface UseApiReturn<T> extends AsyncState<T> {
    execute: (...args: unknown[]) => Promise<T | null>;
    reset: () => void;
    setData: (data: T | null) => void;
}

const INITIAL_STATE = { data: null, loading: false, error: null };

export function useApi<T>(
    fn: (...args: unknown[]) => Promise<T>,
    options: UseApiOptions<T> = {},
): UseApiReturn<T> {
    const [state, setState] = useState<AsyncState<T>>(INITIAL_STATE);

    const execute = useCallback(
        async (...args: unknown[]): Promise<T | null> => {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                const data = await fn(...args);
                setState({ data, loading: false, error: null });
                options.onSuccess?.(data);
                return data;
            } catch (err) {
                const error =
                    err instanceof Error ? err.message : "Erro desconhecido";
                setState((prev) => ({ ...prev, loading: false, error }));
                options.onError?.(error);
                return null;
            }
        },
        [fn, options],
    );

    const reset = useCallback(() => setState(INITIAL_STATE), []);

    const setData = useCallback(
        (data: T | null) => setState((prev) => ({ ...prev, data })),
        [],
    );

    return { ...state, execute, reset, setData };
}
