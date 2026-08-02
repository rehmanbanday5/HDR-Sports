import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-HDR py-16 max-w-md">
      <h1 className="font-display text-3xl font-bold mb-2">Create your account</h1>
      <p className="text-ink-soft mb-8">Save addresses and orders across visits.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-1.5 block">Full Name</label>
          <input required name="name" value={form.name} onChange={handleChange} className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-1.5 block">Email</label>
          <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-1.5 block">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-ink-soft mb-1.5 block">Password</label>
          <input required type="password" name="password" value={form.password} onChange={handleChange} minLength={8} className="w-full border border-ink/20 rounded-sm px-4 py-2.5 text-sm" />
          <p className="text-xs text-ink-soft mt-1">At least 8 characters.</p>
        </div>
        <button type="submit" disabled={submitting} className="w-full bg-[#0D111A] text-white py-3 rounded-xl font-bold transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0D111A]">
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account? <Link to="/login" className="text-pitch font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
