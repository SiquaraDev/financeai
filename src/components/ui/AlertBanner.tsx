import { IconAlert } from "@/components/icons";

interface AlertBannerProps {
    message: string;
    variant?: "danger" | "success" | "warning";
}

const VARIANT_STYLES = {
    danger: {
        background: "var(--color-danger-bg)",
        border: "1px solid var(--color-danger-border)",
        color: "var(--color-danger-light)",
    },
    success: {
        background: "var(--color-success-bg)",
        border: "1px solid var(--color-success-border)",
        color: "var(--color-success-light)",
    },
    warning: {
        background: "var(--color-warning-bg)",
        border: "1px solid var(--color-warning-border)",
        color: "var(--color-warning-light)",
    },
};

export default function AlertBanner({
    message,
    variant = "danger",
}: AlertBannerProps) {
    const styles = VARIANT_STYLES[variant];
    return (
        <div
            className="animate-fade-in"
            style={{
                ...styles,
                borderRadius: "var(--radius-md)",
                padding: "10px 13px",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "var(--text-sm)",
            }}
        >
            <IconAlert />
            {message}
        </div>
    );
}
