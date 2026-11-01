import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const { user, login } = useAuth();
  const [f, setF] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" />;
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await login(f.email, f.password); toast.success('Welcome back!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    setBusy(false);
  };
  return (
    <div className="login">
      <div className="hero"><h1>🏥 Hospital<br />Management System</h1><p>Patients, doctors, billing, pharmacy and more — in one secure admin panel.</p></div>
      <form className="lcard pop" onSubmit={submit}>
        <h2>Admin Login</h2>
        <label>Email</label><input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="admin@admin.com" />
        <label>Password</label><input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="••••••••" />
        <button className="btn full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
