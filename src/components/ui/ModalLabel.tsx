interface ModalLabelProps {
    children: React.ReactNode;
    htmlFor?: string;
}

export default function ModalLabel({ children, htmlFor }: ModalLabelProps) {
    return (
        <label
            htmlFor={htmlFor}
            style={{
                display: "block",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                color: "var(--text-secondary)",
                marginBottom: ".375rem",
                textTransform: "uppercase",
                letterSpacing: ".05em",
            }}
        >
            {children}
        </label>
    );
}
