import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Modal from '../components/Modal';
import { modules } from '../config/modules';

export default function CrudPage() {
  const { key } = useParams();
  const m = modules[key];
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(null);
  const [refs, setRefs] = useState({});
  const load = () => api.get(`/${key}`, { params: { q } }).then((r) => setRows(r.data));

  useEffect(() => { if (m) { const t = setTimeout(load, 250); return () => clearTimeout(t); } }, [key, q]);
  useEffect(() => {
    if (!m) return;
    setQ(''); setForm(null);
    m.fields.filter((f) => f.ref).forEach((f) => api.get('/' + f.ref).then((r) => setRefs((p) => ({ ...p, [f.ref]: r.data.map((x) => x.name) }))));
  }, [key]);
  if (!m) return <Navigate to="/" />;

  const today = new Date().toISOString().slice(0, 10);
  const openNew = () => setForm(Object.fromEntries(m.fields.map((f) => [f.k, f.o ? f.o[0] : f.ref ? refs[f.ref]?.[0] || '' : f.t === 'date' ? today : ''])));
  const save = async (e) => {
    e.preventDefault();
    try { form._id ? await api.put(`/${key}/${form._id}`, form) : await api.post(`/${key}`, form); toast.success('Saved'); setForm(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
  };
  const del = async (r) => { if (!confirm('Delete this record?')) return; await api.delete(`/${key}/${r._id}`); toast.success('Deleted'); load(); };

  return (
    <>
      <div className="row"><h2 className="ttl">{m.icon} {m.title}</h2><div className="grow" />
        <input className="search" placeholder="🔍 Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" onClick={openNew}>+ Add</button></div>
      <div className="card tw"><table>
        <thead><tr>{m.fields.map((f) => <th key={f.k}>{f.l}</th>)}<th /></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r._id}>{m.fields.map((f) => <td key={f.k}>{f.k === 'status' ? <span className={'tag ' + r[f.k]}>{r[f.k]}</span> : r[f.k]}</td>)}
            <td className="acts"><button className="btn sm" onClick={() => setForm(r)}>Edit</button><button className="btn sm danger" onClick={() => del(r)}>Delete</button></td></tr>))}
          {!rows.length && <tr><td colSpan={m.fields.length + 1} className="muted">No records yet. Click “+ Add”.</td></tr>}</tbody></table></div>
      {form && (
        <Modal title={(form._id ? 'Edit ' : 'Add ') + m.title} onClose={() => setForm(null)}>
          <form onSubmit={save} className="fgrid">
            {m.fields.map((f) => (
              <div key={f.k}><label>{f.l}</label>
                {f.o || f.ref
                  ? <select value={form[f.k] ?? ''} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}>{(f.o || refs[f.ref] || []).map((o) => <option key={o}>{o}</option>)}</select>
                  : <input type={f.t || 'text'} required={f === m.fields[0]} value={form[f.k] ?? ''} onChange={(e) => setForm({ ...form, [f.k]: f.t === 'number' ? +e.target.value : e.target.value })} />}
              </div>))}
            <button className="btn full">{form._id ? 'Update' : 'Save'}</button>
          </form>
        </Modal>)}
    </>
  );
}
