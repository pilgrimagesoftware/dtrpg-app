// chrome.jsx — desktop window chrome, sidebar, and toolbar. window.{AppWindow,Sidebar,Toolbar}

function TrafficLights() {
  return (
    <div className="traffic" aria-hidden="true">
      <span className="tl tl-r" /><span className="tl tl-y" /><span className="tl tl-g" />
    </div>
  );
}

function NavItem({ label, count, active, onClick }) {
  return (
    <button className={'nav-item' + (active ? ' is-active' : '')} onClick={onClick}>
      <span className="nav-label">{label}</span>
      {count != null && <span className="nav-count">{count}</span>}
    </button>
  );
}

function Sidebar({ filter, counts, onSelect, totalSize }) {
  const is = (type, value) => filter.type === type && filter.value === value;
  return (
    <nav className="sidebar">
      <header className="side-head">
        <TrafficLights />
        <div className="wordmark">
          <span className="logo-mark" aria-hidden="true" />
          <span className="wordmark-text">Folio</span>
        </div>
      </header>

      <div className="side-scroll">
        <div className="side-sect">
          <div className="side-label">Library</div>
          <NavItem label="All Titles" count={counts.all} active={is('all')} onClick={() => onSelect({ type: 'all' })} />
          <NavItem label="Recently Added" count={counts.recent} active={is('recent')} onClick={() => onSelect({ type: 'recent' })} />
          <NavItem label="On This Device" count={counts.downloaded} active={is('downloaded')} onClick={() => onSelect({ type: 'downloaded' })} />
          <NavItem label="In the Cloud" count={counts.cloud} active={is('cloud')} onClick={() => onSelect({ type: 'cloud' })} />
        </div>

        <div className="side-sect">
          <div className="side-label">Publishers</div>
          {PUBLISHERS.map((p) => (
            <NavItem key={p.name} label={p.name} count={p.count}
                     active={is('publisher', p.name)}
                     onClick={() => onSelect({ type: 'publisher', value: p.name })} />
          ))}
        </div>
      </div>

      <footer className="side-foot">
        <span>{counts.all} titles</span>
        <span>{totalSize}</span>
      </footer>
    </nav>
  );
}

function Segmented({ value, options, onChange, ariaLabel }) {
  return (
    <div className="seg" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button key={o.value} className={'seg-btn' + (value === o.value ? ' is-on' : '')}
                onClick={() => onChange(o.value)} title={o.title} aria-pressed={value === o.value}>
          {o.icon ? o.icon : o.label}
        </button>
      ))}
    </div>
  );
}

function Toolbar({ title, count, layout, onLayout, grouped, onGrouped, sort, onSort, search, onSearch }) {
  return (
    <div className="toolbar">
      <div className="tb-title">
        <h1>{title}</h1>
        <span className="tb-count">{count} {count === 1 ? 'title' : 'titles'}</span>
      </div>

      <div className="tb-controls">
        <label className="search">
          <Icon.search size={14} />
          <input type="text" value={search} placeholder="Search library"
                 onChange={(e) => onSearch(e.target.value)} />
          {search && (
            <button className="search-clear" onClick={() => onSearch('')} aria-label="Clear search">
              <Icon.close size={12} />
            </button>
          )}
        </label>

        <div className="select-wrap">
          <select className="sort-select" value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Sort by">
            <option value="title">Title</option>
            <option value="publisher">Publisher</option>
            <option value="added">Date added</option>
            <option value="pages">Page count</option>
          </select>
          <Icon.chevron size={13} />
        </div>

        <button className={'group-toggle' + (grouped ? ' is-on' : '')}
                onClick={() => onGrouped(!grouped)} aria-pressed={grouped}>
          {grouped ? <Icon.check size={13} /> : <span className="gt-dot" />}
          Group by publisher
        </button>

        <Segmented value={layout} onChange={onLayout} ariaLabel="Layout"
          options={[
            { value: 'list', icon: <Icon.layoutList />, title: 'List' },
            { value: 'thumbs', icon: <Icon.layoutThumbs />, title: 'List with covers' },
            { value: 'grid', icon: <Icon.layoutGrid />, title: 'Grid' },
          ]} />
      </div>
    </div>
  );
}

function AppWindow({ sidebar, toolbar, detail, children }) {
  return (
    <div className="desktop">
      <div className="window">
        {sidebar}
        <div className="main">
          {toolbar}
          <div className="main-body">
            <div className="scroll">{children}</div>
            {detail}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AppWindow, Sidebar, Toolbar });
