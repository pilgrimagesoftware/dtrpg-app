// covers.jsx — original generative book covers built from a book's own metadata.
// No real cover art is reproduced; each cover is a typographic composition.
// Exposed as window.Cover and window.coverVars.

function __hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Relative luminance → pick cream or ink ink-text on the cover field.
function __isLight(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16),
        g = parseInt(h.slice(2, 4), 16),
        b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function coverVars(book) {
  const light = __isLight(book.color);
  const fg = light ? '#1c1813' : '#efe6d2';
  const fgRgb = light ? '28,24,19' : '239,230,210';
  const h = __hash(book.id + book.title);
  return {
    '--cover-bg': book.color,
    '--cover-fg': fg,
    '--cover-fg-70': `rgba(${fgRgb},0.70)`,
    '--cover-fg-45': `rgba(${fgRgb},0.45)`,
    '--cover-fg-22': `rgba(${fgRgb},0.22)`,
    '--cover-fg-12': `rgba(${fgRgb},0.12)`,
    '--cover-seed': (h % 360),
    motif: h % 4, // 0 circle · 1 diamond · 2 double-rule · 3 triangle
  };
}

function CoverMotif({ kind }) {
  if (kind === 0) return <span className="cv-motif cv-circle" aria-hidden="true" />;
  if (kind === 1) return <span className="cv-motif cv-diamond" aria-hidden="true" />;
  if (kind === 3) return <span className="cv-motif cv-triangle" aria-hidden="true" />;
  return <span className="cv-motif cv-rule" aria-hidden="true" />;
}

// A single generative cover. Sizing is controlled by the parent via CSS class.
function Cover({ book }) {
  const v = coverVars(book);
  const { motif, ...style } = v;
  return (
    <div className="cover" data-motif={motif} style={style}>
      <div className="cv-grain" aria-hidden="true" />
      <div className="cv-frame" aria-hidden="true" />
      <div className="cv-top">{book.publisher}</div>
      <div className="cv-center">
        <CoverMotif kind={motif} />
        <div className="cv-title">{book.title}</div>
        <div className="cv-line" aria-hidden="true" />
      </div>
      <div className="cv-bottom">{book.line}</div>
    </div>
  );
}

Object.assign(window, { Cover, coverVars });
