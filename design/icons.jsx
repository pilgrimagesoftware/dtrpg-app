// icons.jsx — minimal line icons (UI glyphs only). Stroke uses currentColor.
// Exposed as window.Icon.

const Icon = {
  search: (p = {}) => (
    <svg viewBox="0 0 16 16" width={p.size || 15} height={p.size || 15} fill="none"
         stroke="currentColor" strokeWidth="1.4" className={p.className} aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" strokeLinecap="round" />
    </svg>
  ),
  chevron: (p = {}) => (
    <svg viewBox="0 0 16 16" width={p.size || 14} height={p.size || 14} fill="none"
         stroke="currentColor" strokeWidth="1.4" className={p.className} aria-hidden="true">
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: (p = {}) => (
    <svg viewBox="0 0 16 16" width={p.size || 14} height={p.size || 14} fill="none"
         stroke="currentColor" strokeWidth="1.6" className={p.className} aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // cloud with down arrow = available, not downloaded
  cloud: (p = {}) => (
    <svg viewBox="0 0 18 16" width={p.size || 15} height={p.size || 15} fill="none"
         stroke="currentColor" strokeWidth="1.3" className={p.className} aria-hidden="true">
      <path d="M4.6 12.5a3.1 3.1 0 0 1-.3-6.2A4 4 0 0 1 12 5.4a2.9 2.9 0 0 1 1.5 5.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7.5v5m0 0L7 10.5M9 12.5l2-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // filled dot = downloaded / on device
  dot: (p = {}) => (
    <svg viewBox="0 0 12 12" width={p.size || 9} height={p.size || 9} className={p.className} aria-hidden="true">
      <circle cx="6" cy="6" r="4" fill="currentColor" />
    </svg>
  ),
  download: (p = {}) => (
    <svg viewBox="0 0 16 16" width={p.size || 15} height={p.size || 15} fill="none"
         stroke="currentColor" strokeWidth="1.4" className={p.className} aria-hidden="true">
      <path d="M8 2.5v8m0 0L4.8 7.3M8 10.5l3.2-3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 13h10" strokeLinecap="round" />
    </svg>
  ),
  book: (p = {}) => (
    <svg viewBox="0 0 16 16" width={p.size || 15} height={p.size || 15} fill="none"
         stroke="currentColor" strokeWidth="1.4" className={p.className} aria-hidden="true">
      <path d="M3 3.2h4a2 2 0 0 1 2 2v8a1.6 1.6 0 0 0-1.6-1.6H3z" strokeLinejoin="round" />
      <path d="M13 3.2H9a2 2 0 0 0-2 2v8a1.6 1.6 0 0 1 1.6-1.6H13z" strokeLinejoin="round" />
    </svg>
  ),
  // layout: text list (just rows)
  layoutList: (p = {}) => (
    <svg viewBox="0 0 16 16" width={p.size || 15} height={p.size || 15} fill="none"
         stroke="currentColor" strokeWidth="1.4" className={p.className} aria-hidden="true">
      <path d="M3 4.5h10M3 8h10M3 11.5h10" strokeLinecap="round" />
    </svg>
  ),
  // layout: list with thumbnails (leading squares + lines)
  layoutThumbs: (p = {}) => (
    <svg viewBox="0 0 16 16" width={p.size || 15} height={p.size || 15} fill="none"
         stroke="currentColor" strokeWidth="1.3" className={p.className} aria-hidden="true">
      <rect x="2.5" y="3" width="3.2" height="3.2" rx="0.6" />
      <rect x="2.5" y="9.8" width="3.2" height="3.2" rx="0.6" />
      <path d="M7.6 4.1h6M7.6 5.6h4M7.6 10.9h6M7.6 12.4h4" strokeLinecap="round" />
    </svg>
  ),
  // layout: grid
  layoutGrid: (p = {}) => (
    <svg viewBox="0 0 16 16" width={p.size || 15} height={p.size || 15} fill="none"
         stroke="currentColor" strokeWidth="1.3" className={p.className} aria-hidden="true">
      <rect x="2.6" y="2.6" width="4.4" height="4.4" rx="0.7" />
      <rect x="9" y="2.6" width="4.4" height="4.4" rx="0.7" />
      <rect x="2.6" y="9" width="4.4" height="4.4" rx="0.7" />
      <rect x="9" y="9" width="4.4" height="4.4" rx="0.7" />
    </svg>
  ),
  close: (p = {}) => (
    <svg viewBox="0 0 16 16" width={p.size || 15} height={p.size || 15} fill="none"
         stroke="currentColor" strokeWidth="1.5" className={p.className} aria-hidden="true">
      <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  ),
};

Object.assign(window, { Icon });
