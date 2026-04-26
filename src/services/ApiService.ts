export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly body?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined | null>;
}

export abstract class ApiService {
    protected readonly basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    protected buildUrl(
        path: string,
        params?: Record<string, string | number | boolean | undefined | null>,
    ): string {
        const url = new URL(
            `${this.basePath}${path}`,
            typeof window !== "undefined"
                ? window.location.origin
                : "http://localhost:3000",
        );

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    url.searchParams.set(key, String(value));
                }
            });
        }

        return url.pathname + url.search;
    }

    protected async request<T>(
        path: string,
        options: RequestOptions = {},
    ): Promise<T> {
        const { method = "GET", body, params } = options;

        const url = this.buildUrl(path, params);

        const init: RequestInit = {
            method,
            headers: body ? { "Content-Type": "application/json" } : {},
            ...(body ? { body: JSON.stringify(body) } : {}),
        };

        const response = await fetch(url, init);

        if (!response.ok) {
            let errorBody: unknown;
            try {
                errorBody = await response.json();
            } catch {
                errorBody = null;
            }
            throw new ApiError(
                response.status,
                `API error ${response.status}: ${response.statusText}`,
                errorBody,
            );
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return response.json() as Promise<T>;
    }

    protected get<T>(
        path: string,
        params?: Record<string, string | number | boolean | undefined | null>,
    ): Promise<T> {
        return this.request<T>(path, { method: "GET", params });
    }

    protected post<T>(path: string, body: unknown): Promise<T> {
        return this.request<T>(path, { method: "POST", body });
    }

    protected put<T>(path: string, body: unknown): Promise<T> {
        return this.request<T>(path, { method: "PUT", body });
    }

    protected delete<T>(path: string): Promise<T> {
        return this.request<T>(path, { method: "DELETE" });
    }
}
