interface OrbConfig {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width: string;
    height: string;
    color: string;
    animation: string;
}

const DEFAULT_ORBS: OrbConfig[] = [
    {
        top: "-10%",
        left: "-6%",
        width: "540px",
        height: "540px",
        color: "rgba(26,111,240,0.15)",
        animation: "orb-float 9s ease-in-out infinite",
    },
    {
        bottom: "-14%",
        right: "-8%",
        width: "620px",
        height: "620px",
        color: "rgba(20,184,166,0.10)",
        animation: "orb-float-alt 12s ease-in-out infinite",
    },
    {
        top: "40%",
        left: "30%",
        width: "320px",
        height: "320px",
        color: "rgba(139,92,246,0.05)",
        animation: "orb-float 16s ease-in-out infinite 3s",
    },
];

interface OrbBackgroundProps {
    orbs?: OrbConfig[];
}

export default function OrbBackground({
    orbs = DEFAULT_ORBS,
}: OrbBackgroundProps) {
    return (
        <>
            <style>{`
        @keyframes orb-float {
          0%, 100% { transform: translateY(0px)   scale(1);    }
          50%       { transform: translateY(-20px) scale(1.04); }
        }
        @keyframes orb-float-alt {
          0%, 100% { transform: translateY(0px)  scale(1);    }
          50%       { transform: translateY(16px) scale(0.97); }
        }
      `}</style>
            {orbs.map((orb, i) => (
                <div
                    key={i}
                    aria-hidden
                    style={{
                        position: "fixed",
                        top: orb.top,
                        bottom: orb.bottom,
                        left: orb.left,
                        right: orb.right,
                        width: orb.width,
                        height: orb.height,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${orb.color} 0%, transparent 68%)`,
                        pointerEvents: "none",
                        animation: orb.animation,
                    }}
                />
            ))}
        </>
    );
}
