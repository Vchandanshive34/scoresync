import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Logo } from './ui';

const MENU = [
  { to: '/', label: 'League dashboard', end: true },
  { to: '/leagues/new', label: 'Create league', end: false },
  { to: '/leagues/upcoming', label: 'Upcoming leagues', end: false },
  { to: '/leagues/past', label: 'Past leagues', end: false },
  { to: '/judges', label: 'Judge list', end: false },
  { to: '/fighters', label: 'Fighter list', end: false },
];

function Toast() {
  const { state, dispatch } = useStore();
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (!state.toast) {
      setShown(null);
      return;
    }
    setShown(state.toast);
    const id = window.setTimeout(() => {
      setShown(null);
      dispatch({ type: 'toast/clear' });
    }, 2600);
    return () => window.clearTimeout(id);
  }, [state.seq, state.toast, dispatch]);

  if (!shown) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      {shown}
    </div>
  );
}

export default function Shell() {
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <NavLink to="/">
          <Logo />
        </NavLink>
        <div className="header-right">
          <span className="welcome">Welcome {state.user}</span>
          <button
            type="button"
            className="burger"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      {open ? (
        <>
          <div className="scrim" onClick={() => setOpen(false)} />
          <nav className="drawer" aria-label="Main menu">
            <h2>Menu</h2>
            {MENU.map((m) => (
              <NavLink key={m.to} to={m.to} end={m.end}>
                {m.label}
              </NavLink>
            ))}
            <div className="spacer" />
            <button type="button" className="btn btn-back" onClick={() => setOpen(false)}>
              Close
            </button>
          </nav>
        </>
      ) : null}

      <Toast />
    </div>
  );
}
