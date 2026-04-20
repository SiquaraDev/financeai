import Button from "./Button";

interface PaginationProps {
    page: number;
    total: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    page,
    total,
    pageSize = 15,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(total / pageSize);
    if (total <= pageSize) return null;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: ".75rem",
                marginTop: "1.25rem",
                flexWrap: "wrap",
            }}
        >
            <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => onPageChange(Math.max(1, page - 1))}
                style={{ opacity: page === 1 ? 0.4 : 1 }}
            >
                ← Anterior
            </Button>
            <span
                style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-muted)",
                }}
            >
                {page} / {totalPages}
            </span>
            <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                style={{ opacity: page >= totalPages ? 0.4 : 1 }}
            >
                Próxima →
            </Button>
        </div>
    );
}
