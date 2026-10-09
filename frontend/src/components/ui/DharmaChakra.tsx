"use client";

interface DharmaChakraProps {
  className?: string;
  spinning?: boolean;
}

export default function DharmaChakra({ className = "w-8 h-8", spinning = true }: DharmaChakraProps) {
  const angles = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5];

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} ${spinning ? "animate-spin" : ""}`}
      style={{ animationDuration: "10s" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer concentric golden rims */}
      <circle cx="50" cy="50" r="47" stroke="#D4AF37" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="42" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
      
      {/* Inner hub */}
      <circle cx="50" cy="50" r="14" stroke="#D4AF37" strokeWidth="2" fill="#08090C" />
      <circle cx="50" cy="50" r="6" fill="#D4AF37" />

      {/* 16 Spokes of the Sacred Wheel */}
      {angles.map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 50 + 14 * Math.cos(rad);
        const y1 = 50 + 14 * Math.sin(rad);
        const x2 = 50 + 42 * Math.cos(rad);
        const y2 = 50 + 42 * Math.sin(rad);
        return (
          <line
            key={idx}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#D4AF37"
            strokeWidth={idx % 2 === 0 ? "1.8" : "1"}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
