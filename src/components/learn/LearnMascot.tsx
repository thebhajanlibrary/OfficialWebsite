type Mood = "idle" | "correct" | "incorrect" | "complete" | "rest";

export function LearnMascot({ mood = "idle", className = "h-28 w-28", decorative = false }: {
  mood?: Mood; className?: string; decorative?: boolean;
}) {
  const happy = mood === "correct" || mood === "complete";
  return (
    <svg viewBox="0 0 160 160" className={`mor ${className}`} data-mood={mood}
      role={decorative ? undefined : "img"} aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `Mor, your peacock learning companion${happy ? ", celebrating" : mood === "incorrect" ? ", thinking with you" : ""}`}>
      <ellipse cx="80" cy="148" rx="35" ry="6" fill="#163f45" opacity=".12" />
      <g className="mor-bird">
        <g className="mor-tail">
          {[-60, -40, -20, 0, 20, 40, 60].map((angle, i) => (
            <g key={angle} transform={`rotate(${angle} 80 112)`}>
              <path d="M80 120C66 101 54 60 62 37C67 22 93 22 98 37C106 60 94 101 80 120Z" fill={i % 2 ? "#168d80" : "#20b49a"} stroke="#126c68" strokeWidth="2" />
              <path d="M80 89C70 73 66 54 70 43C73 34 87 34 90 43C94 54 90 73 80 89Z" fill="#a4dc6b" />
              <ellipse cx="80" cy="51" rx="8" ry="11" fill="#ffe19a" />
              <ellipse cx="80" cy="52" rx="5" ry="7" fill="#17647b" />
              <circle cx="81" cy="50" r="2" fill="#a3ece0" />
            </g>
          ))}
        </g>
        <path d="M64 134L60 145H48M96 134L100 145H112" fill="none" stroke="#dc8a31" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M46 100C46 76 114 76 114 100L112 117C108 149 52 149 48 117Z" fill="#156e89" />
        <ellipse cx="80" cy="117" rx="23" ry="21" fill="#39afbd" />
        <path d={happy ? "M48 105Q21 91 30 76Q46 78 57 97" : "M49 99Q30 100 38 122Q49 130 60 112"} fill="#12586f" />
        <path d={happy ? "M112 105Q139 91 130 76Q114 78 103 97" : "M111 99Q130 100 122 122Q111 130 100 112"} fill="#12586f" />
        <g className="mor-head">
          <path d="M72 40L64 24M80 37V18M88 40L96 24" fill="none" stroke="#176c80" strokeWidth="4" strokeLinecap="round" />
          <g fill="#29baa5"><circle cx="63" cy="22" r="5" /><circle cx="80" cy="16" r="6" /><circle cx="97" cy="22" r="5" /></g>
          <path d="M43 70C43 24 117 24 117 70V82C117 115 43 115 43 82Z" fill="#208eab" />
          <path d="M48 64C48 47 70 45 80 61C90 45 112 47 112 64V79C112 103 48 103 48 79Z" fill="#effbf1" />
          <g className="mor-eye" fill="#173c4c">
            {happy || mood === "rest" ? <path d="M57 73Q63 62 69 73M91 73Q97 62 103 73" fill="none" stroke="#173c4c" strokeWidth="4" strokeLinecap="round" /> : <>
              <ellipse cx="64" cy="71" rx="6" ry={mood === "incorrect" ? 7 : 9} /><ellipse cx="96" cy="71" rx="6" ry="9" />
              <circle cx="66" cy="68" r="2.2" fill="white" /><circle cx="98" cy="68" r="2.2" fill="white" />
            </>}
          </g>
          {mood === "incorrect" && <path d="M56 57L70 60M90 58L102 54" stroke="#173c4c" strokeWidth="3" strokeLinecap="round" />}
          <ellipse cx="54" cy="83" rx="6" ry="3.5" fill="#f2a99a" /><ellipse cx="106" cy="83" rx="6" ry="3.5" fill="#f2a99a" />
          <path d={happy ? "M69 82Q80 76 91 82L80 97Z" : "M69 82Q80 76 91 82L80 91Z"} fill="#f6b943" stroke="#dc8a31" strokeWidth="1.5" strokeLinejoin="round" />
          {happy && <path d="M75 86H85L80 91Z" fill="#97452c" />}
        </g>
        {mood === "complete" && <g fill="#f6b943"><path d="M23 19L26 27L34 30L26 33L23 41L20 33L12 30L20 27Z" /><path d="M137 47L140 54L147 57L140 60L137 67L134 60L127 57L134 54Z" /></g>}
      </g>
    </svg>
  );
}
