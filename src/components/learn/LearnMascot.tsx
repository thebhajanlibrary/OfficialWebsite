type Mood = "idle" | "correct" | "incorrect" | "complete" | "rest";

const FEATHERS = [
  { rot: -46, fill: "#1c1915", eye: "#e7c27a" },
  { rot: -23, fill: "#9a6b32", eye: "#fffaf3" },
  { rot: 0, fill: "#1f4f4a", eye: "#e7c27a" },
  { rot: 23, fill: "#9a6b32", eye: "#fffaf3" },
  { rot: 46, fill: "#1c1915", eye: "#e7c27a" },
] as const;

export function LearnMascot({
  mood = "idle",
  className = "h-28 w-28",
  decorative = false,
}: {
  mood?: Mood;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`mor ${className}`}
      data-mood={mood}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "Mor, the Bhajan Learn peacock"}
    >
      <g className="mor-bird">
        <g transform="translate(52 86)">
          <g className="mor-tail">
            {FEATHERS.map((feather) => (
              <g key={feather.rot} transform={`rotate(${feather.rot})`}>
                <path d="M0 2C8-12 9-30 0-46C-9-30-8-12 0 2Z" fill={feather.fill} />
                <circle cx="0" cy="-30" r="4.4" fill={feather.eye} />
                <circle cx="0" cy="-30" r="1.8" fill="#1c1915" />
              </g>
            ))}
          </g>
        </g>

        <ellipse cx="54" cy="90" rx="20" ry="15" fill="#fffaf3" stroke="#1c1915" strokeWidth="1.6" />
        <ellipse cx="46" cy="88" rx="9" ry="6" fill="#f4ecdf" stroke="#1c1915" strokeWidth="1.3" transform="rotate(-16 46 88)" />

        <g className="mor-head">
          <path
            d="M66 80c8-4 14-14 14-24"
            fill="none"
            stroke="#1c1915"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M66 80c8-4 14-14 14-24"
            fill="none"
            stroke="#fffaf3"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="82" cy="52" r="13" fill="#fffaf3" stroke="#1c1915" strokeWidth="1.6" />
          <ellipse cx="74" cy="36" rx="2" ry="5" fill="#9a6b32" transform="rotate(-24 74 36)" />
          <ellipse cx="82" cy="32" rx="2.1" ry="6" fill="#e7c27a" />
          <ellipse cx="90" cy="36" rx="2" ry="5" fill="#9a6b32" transform="rotate(22 90 36)" />
          <path d="M92 50l10 3.2-10 3.2z" fill="#9a6b32" />
          <g className="mor-eye">
            <circle cx="86" cy="51" r="3.1" fill="#1c1915" />
            <circle cx="87" cy="50" r="1" fill="#fffaf3" />
          </g>
        </g>

        <path
          d="M46 104l-5 7M41 111h7M62 104l4 7M63 111h7"
          fill="none"
          stroke="#9a6b32"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
