/**
 * AuthAside
 *
 * Generic left-panel for auth pages (login / register).
 * Renders: logo + brand name, headline, body text, slot for feature content,
 * and an optional footer note.
 *
 * Hidden below 1024 px via the injected media-query class.
 */

import React from "react";
import LogoMark from "./LogoMark";

interface AuthAsideProps {
  /** Main headline. Supports a JSX gradient span or plain text. */
  headline: React.ReactNode;
  /** Supporting paragraph below the headline. */
  description: string;
  /** Feature content slot — renders StatHighlights, CheckLists, promo cards, etc. */
  children: React.ReactNode;
  /** Optional footer row (e.g. security note). */
  footer?: React.ReactNode;
  /** CSS class added to the outer wrapper — used for responsive hiding. */
  className?: string;
}

export default function AuthAside({
  headline,
  description,
  children,
  footer,
  className = "",
}: AuthAsideProps) {
  return (
    <div
      className={`${className} animate-fade-in`}
      style={{
        flex: "0 0 360px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Brand */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <LogoMark size={42} />
          <span
            className="font-display"
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            Finance
            <span style={{ color: "var(--accent-teal-light)" }}>AI</span>
          </span>
        </div>

        <h2
          className="font-display"
          style={{
            fontSize: "clamp(26px, 2.8vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.18,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}
        >
          {headline}
        </h2>

        <p
          style={{
            fontSize: "var(--text-base)",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
          }}
        >
          {description}
        </p>
      </div>

      {/* Feature slot */}
      {children}

      {/* Optional footer */}
      {footer && footer}
    </div>
  );
}
