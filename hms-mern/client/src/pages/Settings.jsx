import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
const F = [['name', 'Hospital name'], ['address', 'Address'], ['phone', 'Phone'], ['currency', 'Currency symbol'], ['taxRate', 'Tax %', 'number'], ['prefix', 'Bill number prefix'], ['footer', 'Bill footer message']];
export default function Settings() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/settings').then((r) => setS(r.data)); }, []);
  if (!s) return null;
  const save = async (e) => { e.preventDefault(); await api.put('/settings', s); toast.success('Settings saved'); };
  return (
    <>
      <h2 className="ttl">⚙️ Bill Settings</h2>
      <form className="card fgrid" onSubmit={save}>
        {F.map(([k, l, t]) => <div key={k}><label>{l}</label><input type={t || 'text'} value={s[k] ?? ''} onChange={(e) => setS({ ...s, [k]: t ? +e.target.value : e.target.value })} /></div>)}
        <button className="btn full">Save Settings</button>
      </form>
    </>
  );
}
