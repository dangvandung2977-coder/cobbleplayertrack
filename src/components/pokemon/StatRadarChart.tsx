import type { StatSpread } from "@/lib/api/types";
import { getStatValue, hasAnyStats, STAT_KEYS, STAT_LABELS, type StatKey } from "@/lib/pokemon";

type StatRadarChartProps = {
  values?: StatSpread | null;
  maxValue: number;
};

function polarPoint(index: number, radius: number) {
  const angle = (-90 + index * 60) * (Math.PI / 180);
  return {
    x: 120 + Math.cos(angle) * radius,
    y: 120 + Math.sin(angle) * radius,
  };
}

function polygonPoints(values: StatSpread | null | undefined, maxValue: number) {
  return STAT_KEYS.map((key, index) => {
    const rawValue = getStatValue(values, key) ?? 0;
    const ratio = Math.max(0, Math.min(1, rawValue / maxValue));
    const point = polarPoint(index, 72 * ratio);
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function StatRadarChart({ values, maxValue }: StatRadarChartProps) {
  const hasValues = hasAnyStats(values);
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="border border-[#4d5736]/70 bg-[#15180f]/85 p-4">
      <svg viewBox="0 0 240 240" role="img" aria-label="Pokemon stat radar chart" className="h-full w-full">
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={STAT_KEYS.map((_, index) => {
              const point = polarPoint(index, 72 * ring);
              return `${point.x},${point.y}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(183,169,139,0.28)"
            strokeWidth="1"
          />
        ))}

        {STAT_KEYS.map((key, index) => {
          const edge = polarPoint(index, 76);
          const label = polarPoint(index, 98);
          return (
            <g key={key}>
              <line x1="120" y1="120" x2={edge.x} y2={edge.y} stroke="rgba(183,169,139,0.22)" />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#d7ae45"
                fontSize="10"
                fontWeight="800"
              >
                {STAT_LABELS[key as StatKey]}
              </text>
            </g>
          );
        })}

        {hasValues ? (
          <>
            <polygon
              points={polygonPoints(values, maxValue)}
              fill="rgba(89,199,212,0.3)"
              stroke="#59c7d4"
              strokeWidth="3"
            />
            {STAT_KEYS.map((key, index) => {
              const rawValue = getStatValue(values, key) ?? 0;
              const point = polarPoint(index, 72 * Math.max(0, Math.min(1, rawValue / maxValue)));
              return <circle key={key} cx={point.x} cy={point.y} r="3.5" fill="#f4ead2" />;
            })}
          </>
        ) : (
          <text x="120" y="122" textAnchor="middle" fill="#83785f" fontSize="13" fontWeight="800">
            No tracked values
          </text>
        )}
      </svg>
    </div>
  );
}
