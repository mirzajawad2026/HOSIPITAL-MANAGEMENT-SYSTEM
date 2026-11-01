import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { nav } from '../config/modules';
import { useAuth } from '../context/AuthContext';
export default function Layout() {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark');
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('theme', dark ? 'dark' : 'light'); }, [dark]);
  return (
    <div className="app">
      <aside className={'side' + (open ? ' open' : '')}>
        <div className="brand">🏥 <span>HMS<small>Hospital Suite</small></span></div>
        {nav.map((g) => (
          <div key={g.group}>
            <div className="grp">{g.group}</div>
            {g.items.map((i) => (
              <NavLink key={i.to} to={i.to} end className={({ isActive }) => 'nl' + (isActive ? ' on' : '')}>
                <span>{i.icon}</span>{i.label}
              </NavLink>
            ))}
          </div>
        ))}
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="top">
          <button className="btn ghost burger" onClick={() => setOpen(!open)}>☰</button>
          <div className="grow" />
          <span className="muted hide-sm">{user?.email}</span>
          <button className="btn ghost" onClick={() => setDark(!dark)}>{dark ? '☀️' : '🌙'}</button>
          <button className="btn danger" onClick={logout}>Logout</button>
        </header>
        <div className="page fade"><Outlet /></div>
      </div>
    </div>
  );
}
