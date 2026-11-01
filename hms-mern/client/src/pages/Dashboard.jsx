import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';
const COLORS = ['#0e9f8e', '#6c5ce7', '#f39c12', '#e5484d'];
export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/stats').then((r) => setS(r.data)); }, []);
  if (!s) return <div className="muted">Loading…</div>;
  const cards = [
    ['Patients', s.patients, '#0e9f8e,#0b6e8a'], ['Doctors', s.doctors, '#6c5ce7,#a29bfe'],
    ['Pending Appointments', s.pending, '#f39c12,#f7b955'], ['Beds Occupied', `${s.occupied}/${s.totalBeds}`, '#e5484d,#f78c8f'],
    ['Revenue', s.revenue.toFixed(0), '#2d9cdb,#56ccf2'], ['Net Profit', s.profit.toFixed(0), '#16a34a,#4ade80']
  ];
  return (
    <>
      <h2 className="ttl">Dashboard</h2>
      <div className="stats">{cards.map(([l, v, c]) => <div key={l} className="stat" style={{ background: `linear-gradient(135deg,${c})` }}><b>{v}</b>{l}</div>)}</div>
      <div className="two">
        <div className="card"><h3>Monthly revenue</h3>
          <ResponsiveContainer width="100%" height={260}><AreaChart data={s.monthly}>
            <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0e9f8e" stopOpacity={0.5} /><stop offset="95%" stopColor="#0e9f8e" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="month" /><YAxis /><Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#0e9f8e" fill="url(#g)" strokeWidth={3} /></AreaChart></ResponsiveContainer></div>
        <div className="card"><h3>Patients by gender</h3>
          <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={s.gender} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} label>
            {s.gender.map((_, i) => <Cell key={i} fill={COLORS[i % 4]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
      </div>
      <div className="card"><h3>⚠️ Low stock medicines</h3>
        {s.lowStock.length ? s.lowStock.map((m) => <span key={m._id} className="tag Cancelled">{m.name}: {m.stock}</span>) : 'All medicines are well stocked.'}</div>
    </>
  );
}
