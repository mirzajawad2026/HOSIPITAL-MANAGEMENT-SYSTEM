import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
const blank = () => [{ desc: '', qty: 1, price: 0 }];
export default function Billing() {
  const [d, setD] = useState({ patients: [], doctors: [], medicines: [] });
  const [bills, setBills] = useState([]);
  const [set, setSet] = useState({ taxRate: 0, currency: 'Rs.' });
  const [patient, setPatient] = useState('');
  const [items, setItems] = useState(blank());
  const [discount, setDiscount] = useState(0);
  const [pb, setPb] = useState(null);
  const loadBills = () => api.get('/bills').then((r) => setBills(r.data));
  useEffect(() => {
    Promise.all(['patients', 'doctors', 'medicines'].map((k) => api.get('/' + k))).then(([p, dr, me]) => { setD({ patients: p.data, doctors: dr.data, medicines: me.data }); setPatient(p.data[0]?.name || ''); });
    api.get('/settings').then((r) => setSet(r.data)); loadBills();
  }, []);
  const sub = items.reduce((a, i) => a + i.qty * i.price, 0), tax = ((sub - discount) * set.taxRate) / 100, total = sub - discount + tax;
  const upd = (i, patch) => setItems(items.map((x, n) => (n === i ? { ...x, ...patch } : x)));
  const pick = (i, v) => {
    const med = d.medicines.find((x) => x.name === v), doc = d.doctors.find((x) => 'Consultation - ' + x.name === v);
    upd(i, { desc: v, ...(med ? { price: med.price } : doc ? { price: doc.fee } : {}) });
  };
  const save = async () => {
    try { await api.post('/bills', { patient, items: items.filter((i) => i.desc), discount }); toast.success('Bill saved'); setItems(blank()); setDiscount(0); loadBills(); }
    catch (e) { toast.error(e.response?.data?.message || 'Could not save'); }
  };
  const print = (b) => { setPb(b); setTimeout(() => window.print(), 150); };
  const del = async (b) => { if (confirm('Delete this bill?')) { await api.delete('/bills/' + b._id); loadBills(); } };
  const c = set.currency;
  return (
    <>
      <h2 className="ttl">🧾 Billing</h2>
      <div className="card">
        <label>Patient</label>
        <select value={patient} onChange={(e) => setPatient(e.target.value)}>{d.patients.map((p) => <option key={p._id}>{p.name}</option>)}</select>
        <datalist id="dl">{d.doctors.map((x) => <option key={x._id} value={'Consultation - ' + x.name} />)}{d.medicines.map((x) => <option key={x._id} value={x.name} />)}</datalist>
        <div className="tw"><table><thead><tr><th>Description</th><th>Qty</th><th>Price</th><th /></tr></thead><tbody>
          {items.map((it, i) => (<tr key={i}>
            <td><input list="dl" value={it.desc} onChange={(e) => pick(i, e.target.value)} /></td>
            <td><input type="number" min="1" className="w80" value={it.qty} onChange={(e) => upd(i, { qty: +e.target.value })} /></td>
            <td><input type="number" className="w100" value={it.price} onChange={(e) => upd(i, { price: +e.target.value })} /></td>
            <td><button className="btn sm danger" onClick={() => setItems(items.filter((_, n) => n !== i))}>✕</button></td></tr>))}</tbody></table></div>
        <button className="btn ghost sm" onClick={() => setItems([...items, ...blank()])}>+ Add item</button>
        <div className="totals"><div><label>Discount ({c})</label><input type="number" value={discount} onChange={(e) => setDiscount(+e.target.value)} /></div>
          <div className="sum">Subtotal: {c} {sub.toFixed(2)}<br />Tax ({set.taxRate}%): {c} {tax.toFixed(2)}<br /><b>Total: {c} {total.toFixed(2)}</b></div>
          <button className="btn" onClick={save}>Save Bill</button></div>
      </div>
      <div className="card tw"><h3>All Bills</h3><table><thead><tr><th>No</th><th>Patient</th><th>Date</th><th>Total</th><th /></tr></thead><tbody>
        {bills.map((b) => (<tr key={b._id}><td>{b.number}</td><td>{b.patient}</td><td>{new Date(b.createdAt).toLocaleDateString()}</td><td>{c} {b.total.toFixed(2)}</td>
          <td className="acts"><button className="btn sm" onClick={() => print(b)}>🖨 Print</button><button className="btn sm danger" onClick={() => del(b)}>Delete</button></td></tr>))}
        {!bills.length && <tr><td colSpan="5" className="muted">No bills yet</td></tr>}</tbody></table></div>
      {pb && (
        <div className="invoice">
          <div style={{ textAlign: 'center' }}><h1 style={{ margin: 0 }}>{set.name}</h1><div>{set.address} | {set.phone}</div></div><hr />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span><b>Bill No:</b> {pb.number}</span><span><b>Date:</b> {new Date(pb.createdAt).toLocaleDateString()}</span></div>
          <p><b>Patient:</b> {pb.patient}</p>
          <table className="itbl"><thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead><tbody>
            {pb.items.map((i, n) => <tr key={n}><td>{i.desc}</td><td>{i.qty}</td><td>{i.price}</td><td>{(i.qty * i.price).toFixed(2)}</td></tr>)}</tbody></table>
          <div style={{ textAlign: 'right', marginTop: 10 }}>Subtotal: {c} {pb.subtotal.toFixed(2)}<br />Discount: {c} {pb.discount.toFixed(2)}<br />Tax ({pb.taxRate}%): {c} {pb.tax.toFixed(2)}<h3>Total: {c} {pb.total.toFixed(2)}</h3></div>
          <hr /><div style={{ textAlign: 'center' }}>{set.footer}</div>
        </div>)}
    </>
  );
}
