/**
 * StatHighlight
 *
 * Displays a single stat with icon, label, and value inside a themed glass card.
 * Used in the authentication page marketing asides.
 */

import React from "react";

export interface StatHighlightProps {
  icon: string;
  label: string;
  value: string;
  color: string;
  background: string;
  borderColor: string;
  className?: string;
}

export default function StatHighlight({
  icon,
  label,
  value,
  color,
  background,
  borderColor,
  className = "",
}: StatHighlightProps) {
  return (
    <div
      className={`animate-fade-in ${className} card-glass`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1rem",
        background,
        borderColor,
      }}
    >
      <span
        style={{
          fontSize: "18px",
          color,
          minWidth: "20px",
          textAlign: "center",
        }}
      >
        {icon}
      </span>
      <div>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "2px",
          }}
        >
          {label}
        </p>
        <p
          className="font-display"
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 700,
            color,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
