interface FilterOption<T extends string> {
    value: T;
    label: string;
}

interface FilterBarProps<T extends string> {
    options: FilterOption<T>[];
    active: T;
    onChange: (value: T) => void;
}

export default function FilterBar<T extends string>({
    options,
    active,
    onChange,
}: FilterBarProps<T>) {
    return (
        <div
            style={{
                display: "flex",
                gap: ".5rem",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
            }}
        >
            {options.map(({ value, label }) => {
                const isActive = active === value;
                return (
                    <button
                        key={value}
                        onClick={() => onChange(value)}
                        style={{
                            padding: ".375rem .875rem",
                            borderRadius: "var(--radius-full)",
                            fontSize: "var(--text-sm)",
                            fontWeight: isActive ? 600 : 500,
                            fontFamily: "var(--font-body)",
                            cursor: "pointer",
                            transition: "all var(--transition-base)",
                            border: isActive
                                ? "none"
                                : "1px solid var(--border)",
                            background: isActive
                                ? "var(--gradient-brand)"
                                : "transparent",
                            color: isActive
                                ? "var(--text-on-brand)"
                                : "var(--text-muted)",
                            boxShadow: isActive
                                ? "var(--shadow-brand)"
                                : "none",
                        }}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
