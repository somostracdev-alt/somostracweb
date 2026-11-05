export function TractorField() {
  return (
    <div className="ops-field" role="status" aria-live="polite" aria-label="Cargando">
      <svg className="ops-wheat" aria-hidden="true">
        <defs>
          <pattern id="ops-wheat" width="20" height="52" patternUnits="userSpaceOnUse">
            <rect width="20" height="52" fill="#d4b25a" />
            <rect y="42" width="20" height="10" fill="#b08a3e" />
            <path d="M6 46C6 38 5 32 6 22" stroke="#6d8734" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <ellipse cx="6" cy="18" rx="2.3" ry="5" fill="#e7c45c" />
            <ellipse cx="6" cy="17" rx="1.1" ry="3.2" fill="#f6e29a" />
            <path d="M14 47C14 40 13 35 14 27" stroke="#627c30" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <ellipse cx="14" cy="24" rx="1.9" ry="4" fill="#d7b04e" />
            <ellipse cx="14" cy="23" rx="0.9" ry="2.4" fill="#f0d48a" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ops-wheat)" />
      </svg>
      <div className="ops-harvester">
        <div className="ops-swath" />
        <svg className="ops-tractor" viewBox="0 0 214 84" aria-hidden="true">
          <g className="ops-reel">
            <circle cx="168" cy="36" r="13" fill="none" stroke="#5c564e" strokeWidth="1.7" />
            <path d="M168 23v26M155 36h26M159 27l18 18M177 27L159 45" fill="none" stroke="#5c564e" strokeWidth="1.35" strokeLinecap="round" />
            <circle cx="168" cy="36" r="2.1" fill="#5c564e" />
          </g>
          <path d="M126 48h58l12 12H126Z" fill="#3f8f4a" />
          <rect x="124" y="58" width="76" height="4.5" rx="1" fill="#2a302c" />
          <path d="M132 62.5v4.5M144 62.5v4.5M156 62.5v4.5M168 62.5v4.5M180 62.5v4.5M192 62.5v4.5" stroke="#e6c15a" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M22 50c0-14 12-24 22-24s20 10 20 24" fill="#357a40" />
          <rect x="28" y="20" width="30" height="24" rx="3.5" fill="#2f6b3a" />
          <rect x="33" y="24" width="16" height="11" rx="1.5" fill="#d7e4d6" />
          <rect x="54" y="38" width="52" height="16" rx="3" fill="#3f8f4a" />
          <rect x="58" y="43" width="40" height="3" rx="1" fill="#e6c15a" />
          <rect x="102" y="36" width="12" height="18" rx="2" fill="#2f6b3a" />
          <circle cx="108" cy="42" r="2.3" fill="#f7f5f0" />
          <rect x="60" y="14" width="4" height="24" rx="1.5" fill="#5c564e" />
          <rect x="58" y="12" width="8" height="4" rx="1.5" fill="#3a403c" />
          <g className="ops-wheel">
            <circle cx="40" cy="58" r="18" fill="#1c211e" />
            <circle cx="40" cy="58" r="11" fill="#3a403c" />
            <circle cx="40" cy="58" r="3" fill="#e7e4dc" />
            <path d="M40 44v28M26 58h28M30 48l20 20M50 48L30 68" fill="none" stroke="#cfd4cc" strokeWidth="1.6" />
          </g>
          <g className="ops-wheel">
            <circle cx="108" cy="66" r="9" fill="#1c211e" />
            <circle cx="108" cy="66" r="5" fill="#3a403c" />
            <circle cx="108" cy="66" r="1.8" fill="#e7e4dc" />
          </g>
        </svg>
      </div>
      <span className="ops-field-sign">Cargando</span>
    </div>
  );
}
