/** A quiet devotional icon, kept still during answer feedback. */
export function GaneshaGuideIcon({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true" fill="none">
      <circle cx="80" cy="80" r="74" fill="#fff4db" />
      <circle cx="80" cy="76" r="60" stroke="#e8c77b" strokeWidth="2" />
      <path d="M35 137Q43 109 80 109Q117 109 125 137" fill="#c66c38" />
      <path d="M62 115L80 137L98 115" stroke="#f6d788" strokeWidth="5" />
      <path d="M56 61C26 42 21 76 36 99Q45 111 61 94M104 61C134 42 139 76 124 99Q115 111 99 94" fill="#eeb797" stroke="#b87354" strokeWidth="2" />
      <path d="M61 47Q80 32 99 47Q112 61 107 86Q104 102 92 109L92 120Q92 135 78 135Q65 135 68 123" fill="#f5cfaf" stroke="#b87354" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M61 47Q48 61 53 86Q56 101 69 108L69 113" fill="#f5cfaf" stroke="#b87354" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M59 78Q65 73 71 78M91 78Q97 73 102 78" stroke="#67412f" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 91L57 105Q67 103 70 96M98 91L103 103" fill="#fffdf6" stroke="#b87354" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M80 58V69" stroke="#b94732" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="74" r="2" fill="#b94732" />
      <path d="M54 47L51 29L66 35L80 17L94 35L109 29L106 47Z" fill="#e2b451" stroke="#a77829" strokeWidth="2" strokeLinejoin="round" />
      <path d="M56 46H104" stroke="#a77829" strokeWidth="5" strokeLinecap="round" />
      <path d="M80 28L85 36L80 42L75 36Z" fill="#ae4c35" />
    </svg>
  );
}
