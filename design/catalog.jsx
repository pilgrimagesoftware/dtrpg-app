// catalog.jsx — the three catalog layouts (text list · thumbnail list · grid)
// with optional grouping by publisher. Exposes window.Catalog + window.fmt.

const fmt = {
  size: (mb) => (mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB' : mb + ' MB'),
  date: (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  monthYear: (d) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
};

function StatusGlyph({ status }) {
  if (status === 'downloaded') {
    return (
      <span className="status status-down" title="On this device">
        <Icon.dot size={8} />
      </span>
    );
  }
  return (
    <span className="status status-cloud" title="In the cloud — not downloaded">
      <Icon.cloud size={15} />
    </span>
  );
}

function sortBooks(books, sort) {
  const by = {
    title: (a, b) => a.title.localeCompare(b.title),
    publisher: (a, b) => a.publisher.localeCompare(b.publisher) || a.title.localeCompare(b.title),
    added: (a, b) => b.addedTs - a.addedTs,
    pages: (a, b) => b.pages - a.pages || a.title.localeCompare(b.title),
  };
  return [...books].sort(by[sort] || by.title);
}

// ── Text-only row ────────────────────────────────────────────────────────────
function RowText({ book, selected, onOpen }) {
  return (
    <div className={'row-text' + (selected ? ' is-selected' : '')}
         role="button" tabIndex={0} onClick={() => onOpen(book.id)}
         onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(book.id))}>
      <div className="ct ct-title">
        <span className="row-title">{book.title}</span>
        <span className="kind-tag">{book.kind}</span>
      </div>
      <div className="ct ct-pub">{book.publisher}</div>
      <div className="ct ct-sys">{book.line}</div>
      <div className="ct ct-num">{book.pages}</div>
      <div className="ct ct-num">{fmt.size(book.sizeMB)}</div>
      <div className="ct ct-date">{fmt.monthYear(book.added)}</div>
      <div className="ct ct-status"><StatusGlyph status={book.status} /></div>
    </div>
  );
}

function TextHeader() {
  return (
    <div className="row-text row-head" aria-hidden="true">
      <div className="ct ct-title">Title</div>
      <div className="ct ct-pub">Publisher</div>
      <div className="ct ct-sys">System</div>
      <div className="ct ct-num">Pages</div>
      <div className="ct ct-num">Size</div>
      <div className="ct ct-date">Added</div>
      <div className="ct ct-status" />
    </div>
  );
}

// ── Thumbnail row ──────────────────────────────────────────────────────────
function RowThumb({ book, selected, onOpen }) {
  return (
    <div className={'row-thumb' + (selected ? ' is-selected' : '')}
         role="button" tabIndex={0} onClick={() => onOpen(book.id)}
         onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(book.id))}>
      <div className="rt-cover"><Cover book={book} /></div>
      <div className="rt-main">
        <div className="rt-title">{book.title}</div>
        <div className="rt-sub">{book.publisher} · {book.line}</div>
      </div>
      <div className="rt-meta">
        <span className="kind-tag">{book.kind}</span>
        <span className="rt-dim">{book.pages} pp · {fmt.size(book.sizeMB)} · {book.format}</span>
      </div>
      <div className="rt-date">{fmt.monthYear(book.added)}</div>
      <div className="rt-status"><StatusGlyph status={book.status} /></div>
    </div>
  );
}

// ── Grid card ────────────────────────────────────────────────────────────────
function Card({ book, selected, onOpen }) {
  return (
    <div className={'card' + (selected ? ' is-selected' : '')}
         role="button" tabIndex={0} onClick={() => onOpen(book.id)}
         onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(book.id))}>
      <div className="card-cover"><Cover book={book} /></div>
      <div className="card-foot">
        <div className="card-title">{book.title}</div>
        <div className="card-sub">
          <span>{book.publisher}</span>
          <StatusGlyph status={book.status} />
        </div>
      </div>
    </div>
  );
}

function renderItems(books, layout, selectedId, onOpen) {
  if (layout === 'grid') {
    return (
      <div className="grid">
        {books.map((b) => <Card key={b.id} book={b} selected={b.id === selectedId} onOpen={onOpen} />)}
      </div>
    );
  }
  if (layout === 'thumbs') {
    return (
      <div className="list list-thumbs">
        {books.map((b) => <RowThumb key={b.id} book={b} selected={b.id === selectedId} onOpen={onOpen} />)}
      </div>
    );
  }
  return (
    <div className="list list-text">
      {books.map((b) => <RowText key={b.id} book={b} selected={b.id === selectedId} onOpen={onOpen} />)}
    </div>
  );
}

function GroupHeader({ name, count }) {
  return (
    <div className="group-head">
      <h3 className="group-name">{name}</h3>
      <span className="group-count">{count}</span>
    </div>
  );
}

function Catalog({ books, layout, grouped, sort, selectedId, onOpen }) {
  const sorted = sortBooks(books, sort);

  if (sorted.length === 0) {
    return (
      <div className="empty">
        <Icon.search size={22} />
        <p>No titles match.</p>
      </div>
    );
  }

  const showTextHeader = layout === 'list';

  if (!grouped) {
    return (
      <div className="catalog" data-layout={layout}>
        {showTextHeader && <TextHeader />}
        {renderItems(sorted, layout, selectedId, onOpen)}
      </div>
    );
  }

  // group by publisher, groups ordered alphabetically
  const groups = {};
  for (const b of sorted) (groups[b.publisher] ||= []).push(b);
  const names = Object.keys(groups).sort((a, b) => a.localeCompare(b));

  return (
    <div className="catalog" data-layout={layout}>
      {showTextHeader && <TextHeader />}
      {names.map((name) => (
        <section className="group" key={name}>
          <GroupHeader name={name} count={groups[name].length} />
          {renderItems(groups[name], layout, selectedId, onOpen)}
        </section>
      ))}
    </div>
  );
}

Object.assign(window, { Catalog, fmt });
