// detail.jsx — slide-over detail panel for a selected title. window.Detail.

function MetaRow({ label, value }) {
  return (
    <div className="d-meta-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Detail({ book, onClose, onToggleDownload }) {
  // Esc to close
  React.useEffect(() => {
    if (!book) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [book, onClose]);

  const open = !!book;
  return (
    <>
      <div className={'d-scrim' + (open ? ' is-open' : '')} onClick={onClose} aria-hidden="true" />
      <aside className={'detail' + (open ? ' is-open' : '')} aria-hidden={!open}>
        {book && (
          <div className="d-inner">
            <button className="d-close" onClick={onClose} aria-label="Close">
              <Icon.close />
            </button>

            <div className="d-cover"><Cover book={book} /></div>

            <div className="d-head">
              <div className="d-pub">{book.publisher}</div>
              <h2 className="d-title">{book.title}</h2>
              <div className="d-line">{book.line}</div>
            </div>

            <p className="d-desc">{book.desc}</p>

            <div className="d-actions">
              <button className="btn btn-primary">
                <Icon.book size={15} /> Read
              </button>
              {book.status === 'downloaded' ? (
                <button className="btn btn-ghost" onClick={() => onToggleDownload(book.id)}>
                  <Icon.check size={15} /> Downloaded
                </button>
              ) : (
                <button className="btn btn-ghost" onClick={() => onToggleDownload(book.id)}>
                  <Icon.download size={15} /> Download
                </button>
              )}
            </div>

            <dl className="d-meta">
              <MetaRow label="System" value={book.line} />
              <MetaRow label="Category" value={book.kind} />
              <MetaRow label="Format" value={book.format} />
              <MetaRow label="Pages" value={book.pages} />
              <MetaRow label="File size" value={fmt.size(book.sizeMB)} />
              <MetaRow label="Released" value={book.year} />
              <MetaRow label="Added" value={fmt.date(book.added)} />
              <MetaRow label="Status" value={book.status === 'downloaded' ? 'On this device' : 'In the cloud'} />
            </dl>
          </div>
        )}
      </aside>
    </>
  );
}

Object.assign(window, { Detail });
