import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-gully py-16 max-w-md">
      <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
      <p className="text-ink-soft mb-8">Log in to view your orders and saved addresses.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-1.5 block">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-1.5 block">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Don't have an account? <Link to="/register" className="text-pitch font-semibold hover:underline">Create one</Link>
      </p>
    </div>
  );
};

export default Login;
