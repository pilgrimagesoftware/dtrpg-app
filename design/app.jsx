// app.jsx — root: state, filtering, tweaks, composition.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "parchment",
  "accentHue": 25,
  "serif": "Spectral",
  "density": "comfortable",
  "coverStyle": "classic"
}/*EDITMODE-END*/;

const SERIF_STACKS = {
  "Spectral": "'Spectral', Georgia, 'Times New Roman', serif",
  "Newsreader": "'Newsreader', Georgia, 'Times New Roman', serif",
  "Source Serif 4": "'Source Serif 4', Georgia, 'Times New Roman', serif",
};

const THEME_CHIPS = [
  { key: "parchment", sw: ["#FAF7F0", "#26211A", "#7A2E2E"] },
  { key: "slate",     sw: ["#FBFCFD", "#1C2530", "#37607F"] },
  { key: "sage",      sw: ["#F7F8F3", "#23271F", "#46604A"] },
  { key: "ink",       sw: ["#19160F", "#EDE6D6", "#C9A24A"] },
];

const ACCENT_CHIPS = [
  { h: 25,  c: "#8a3a36" },
  { h: 70,  c: "#8a6a2e" },
  { h: 150, c: "#3f6048" },
  { h: 245, c: "#3a6080" },
  { h: 330, c: "#6f3f66" },
];

const RECENT_DAYS = 150;
const RECENT_CUTOFF = Date.now() - RECENT_DAYS * 86400000;

// ── persistence ──────────────────────────────────────────────────────────────
function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
  catch { return fallback; }
}

const VIEW_DEFAULTS = { layout: 'grid', grouped: true, sort: 'title', filter: { type: 'all' } };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const initView = React.useMemo(() => ({ ...VIEW_DEFAULTS, ...loadJSON('folio:view', {}) }), []);
  const [layout, setLayout] = React.useState(initView.layout);
  const [grouped, setGrouped] = React.useState(initView.grouped);
  const [sort, setSort] = React.useState(initView.sort);
  const [filter, setFilter] = React.useState(initView.filter);
  const [search, setSearch] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);
  const [overrides, setOverrides] = React.useState(() => loadJSON('folio:status', {}));

  // apply tweaks to <html>
  React.useEffect(() => {
    const r = document.documentElement;
    r.setAttribute('data-theme', t.theme);
    r.setAttribute('data-density', t.density);
    r.setAttribute('data-cover-style', t.coverStyle);
    r.style.setProperty('--accent-h', t.accentHue);
    r.style.setProperty('--serif', SERIF_STACKS[t.serif] || SERIF_STACKS.Spectral);
  }, [t.theme, t.density, t.coverStyle, t.accentHue, t.serif]);

  // persist view + status
  React.useEffect(() => {
    localStorage.setItem('folio:view', JSON.stringify({ layout, grouped, sort, filter }));
  }, [layout, grouped, sort, filter]);
  React.useEffect(() => {
    localStorage.setItem('folio:status', JSON.stringify(overrides));
  }, [overrides]);

  // effective catalog (status overrides applied)
  const books = React.useMemo(
    () => CATALOG.map((b) => (overrides[b.id] ? { ...b, status: overrides[b.id] } : b)),
    [overrides]
  );

  const counts = React.useMemo(() => ({
    all: books.length,
    recent: books.filter((b) => b.addedTs >= RECENT_CUTOFF).length,
    downloaded: books.filter((b) => b.status === 'downloaded').length,
    cloud: books.filter((b) => b.status === 'cloud').length,
  }), [books]);

  const totalSize = React.useMemo(
    () => fmt.size(books.reduce((s, b) => s + b.sizeMB, 0)),
    [books]
  );

  const filtered = React.useMemo(() => {
    let list = books;
    if (filter.type === 'downloaded') list = list.filter((b) => b.status === 'downloaded');
    else if (filter.type === 'cloud') list = list.filter((b) => b.status === 'cloud');
    else if (filter.type === 'recent') list = list.filter((b) => b.addedTs >= RECENT_CUTOFF);
    else if (filter.type === 'publisher') list = list.filter((b) => b.publisher === filter.value);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((b) =>
      b.title.toLowerCase().includes(q) ||
      b.publisher.toLowerCase().includes(q) ||
      b.line.toLowerCase().includes(q));
    return list;
  }, [books, filter, search]);

  const title = filter.type === 'publisher' ? filter.value : {
    all: 'All Titles', recent: 'Recently Added',
    downloaded: 'On This Device', cloud: 'In the Cloud',
  }[filter.type];

  // recent view is implicitly sorted by date
  const effSort = filter.type === 'recent' && sort === 'title' ? 'added' : sort;

  const selectedBook = selectedId ? books.find((b) => b.id === selectedId) : null;

  const onSelect = (f) => { setFilter(f); setSelectedId(null); };
  const onToggleDownload = (id) => setOverrides((o) => {
    const cur = books.find((b) => b.id === id)?.status;
    return { ...o, [id]: cur === 'downloaded' ? 'cloud' : 'downloaded' };
  });

  return (
    <>
      <AppWindow
        sidebar={<Sidebar filter={filter} counts={counts} totalSize={totalSize} onSelect={onSelect} />}
        toolbar={
          <Toolbar
            title={title} count={filtered.length}
            layout={layout} onLayout={setLayout}
            grouped={grouped} onGrouped={setGrouped}
            sort={sort} onSort={setSort}
            search={search} onSearch={setSearch}
          />
        }
        detail={<Detail book={selectedBook} onClose={() => setSelectedId(null)} onToggleDownload={onToggleDownload} />}
      >
        <Catalog
          books={filtered} layout={layout} grouped={grouped} sort={effSort}
          selectedId={selectedId} onOpen={setSelectedId}
        />
      </AppWindow>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance" />
        <TweakRow label="Theme">
          <div className="twk-chips" role="radiogroup">
            {THEME_CHIPS.map((th) => (
              <button key={th.key} type="button" className="twk-chip"
                      data-on={t.theme === th.key ? '1' : '0'}
                      style={{ background: th.sw[0] }} title={th.key}
                      onClick={() => setTweak('theme', th.key)}>
                <span><i style={{ background: th.sw[1] }} /><i style={{ background: th.sw[2] }} /></span>
              </button>
            ))}
          </div>
        </TweakRow>
        <TweakRow label="Accent">
          <div className="twk-chips" role="radiogroup">
            {ACCENT_CHIPS.map((a) => (
              <button key={a.h} type="button" className="twk-chip"
                      data-on={t.accentHue === a.h ? '1' : '0'}
                      style={{ background: a.c }}
                      onClick={() => setTweak('accentHue', a.h)} />
            ))}
          </div>
        </TweakRow>

        <TweakSection label="Typography" />
        <TweakSelect label="Serif" value={t.serif}
          options={["Spectral", "Newsreader", "Source Serif 4"]}
          onChange={(v) => setTweak('serif', v)} />

        <TweakSection label="Display" />
        <TweakRadio label="Density" value={t.density}
          options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]}
          onChange={(v) => setTweak('density', v)} />
        <TweakRadio label="Cover style" value={t.coverStyle}
          options={[{ value: 'classic', label: 'Classic' }, { value: 'modern', label: 'Modern' }, { value: 'minimal', label: 'Minimal' }]}
          onChange={(v) => setTweak('coverStyle', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
