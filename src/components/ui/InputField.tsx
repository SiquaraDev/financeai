interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    icon: React.ReactNode;
    right?: React.ReactNode;
}

export default function InputField({
    label,
    id,
    icon,
    right,
    ...props
}: InputFieldProps) {
    return (
        <div>
            <label
                htmlFor={id}
                style={{
                    display: "block",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    marginBottom: "var(--space-2)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <span
                    aria-hidden
                    style={{
                        position: "absolute",
                        left: "13px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                    }}
                >
                    {icon}
                </span>
                <input
                    id={id}
                    style={{
                        paddingLeft: "40px",
                        paddingRight: right ? "42px" : "14px",
                        paddingTop: "11px",
                        paddingBottom: "11px",
                        width: "100%",
                    }}
                    {...props}
                />
                {right && (
                    <span
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {right}
                    </span>
                )}
            </div>
        </div>
    );
}
