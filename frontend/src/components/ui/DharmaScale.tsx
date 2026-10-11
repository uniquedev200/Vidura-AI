"use client";

interface DharmaScaleProps {
  riskLevel: string;
  className?: string;
}

export default function DharmaScale({
  riskLevel,
  className = "w-7 h-7",
}: DharmaScaleProps) {
  const normalized = riskLevel.toLowerCase();
  let tiltAngle = 0;
  if (normalized.includes("critical")) {
    tiltAngle = 16;
  } else if (normalized.includes("high")) {
    tiltAngle = 11;
  } else if (
    normalized.includes("moderate") ||
    normalized.includes("medium")
  ) {
    tiltAngle = 5;
  } else {
    tiltAngle = 0;
  }

  const beamColor =
    tiltAngle >= 15 ? "#EF4444" : tiltAngle >= 10 ? "#F59E0B" : "#D4AF37";

  return (
    <div
      aria-hidden="true"
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M48 24 L52 24 L53 82 L47 82 Z" fill="#D4AF37" />
        <path d="M30 84 L70 84 L74 90 L26 90 Z" fill="#D4AF37" />
        <circle
          cx="50"
          cy="24"
          r="5"
          fill="#F59E0B"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />

        <g
          style={{
            transform: `rotate(${tiltAngle}deg)`,
            transformOrigin: "50px 24px",
            transition: "transform 0.5s ease-out",
          }}
        >
          <line
            x1="16"
            y1="24"
            x2="84"
            y2="24"
            stroke={beamColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="16" cy="24" r="3" fill="#D4AF37" />
          <circle cx="84" cy="24" r="3" fill="#D4AF37" />

          <g>
            <line
              x1="16"
              y1="24"
              x2="8"
              y2="52"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeDasharray="2 1"
            />
            <line
              x1="16"
              y1="24"
              x2="24"
              y2="52"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeDasharray="2 1"
            />
            <path
              d="M6 52 C 6 58, 26 58, 26 52 Z"
              fill="rgba(212, 175, 55, 0.25)"
              stroke="#D4AF37"
              strokeWidth="1.5"
            />
          </g>

          <g>
            <line
              x1="84"
              y1="24"
              x2="76"
              y2="52"
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="2 1"
            />
            <line
              x1="84"
              y1="24"
              x2="92"
              y2="52"
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="2 1"
            />
            <path
              d="M74 52 C 74 58, 94 58, 94 52 Z"
              fill="rgba(148, 163, 184, 0.25)"
              stroke="#94A3B8"
              strokeWidth="1.5"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
