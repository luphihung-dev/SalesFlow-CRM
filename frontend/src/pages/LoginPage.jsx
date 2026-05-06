import { ArrowRight, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../api/auth';
import { crmApi } from '../api/crmApi';
import ErrorBanner from '../components/ErrorBanner';
import { getApiErrorMessage } from '../utils/apiErrors';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const session = await crmApi.auth.login(form);
      authStorage.setSession(session);
      navigate('/dashboard', { replace: true });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to sign in.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-ink text-cream lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden p-12 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,111,74,0.45),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(110,139,61,0.4),transparent_32%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between rounded-[2.5rem] border border-white/10 bg-white/10 p-10 shadow-soft backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-clay"><BarChart3 /></div>
            <span className="font-display text-2xl font-bold">Cedar CRM</span>
          </div>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-sand/60">Pipeline command center</p>
            <h1 className="mt-4 max-w-2xl font-display text-6xl font-bold leading-[0.95]">Turn every customer moment into momentum.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-sand/70">A compact CRM dashboard for contacts, deals, tasks, and the automations that keep sales teams moving.</p>
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] bg-cream p-8 text-ink shadow-soft">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-moss">Welcome back</p>
          <h2 className="mt-2 font-display text-4xl font-bold">Sign in</h2>
          <p className="mt-3 text-sm leading-6 text-ink/60">Sign in with a CRM user account. The backend returns a JWT used for secure API calls.</p>
          <div className="mt-5"><ErrorBanner message={error} onDismiss={() => setError('')} /></div>

          <label className="mt-8 block text-sm font-extrabold text-ink" htmlFor="email">Email</label>
          <input id="email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 font-semibold outline-none ring-pine/20 focus:ring-4" placeholder="you@company.com" />

          <label className="mt-5 block text-sm font-extrabold text-ink" htmlFor="password">Password</label>
          <input id="password" required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 font-semibold outline-none ring-pine/20 focus:ring-4" placeholder="••••••••" />

          <button className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-pine font-extrabold text-cream shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Enter dashboard'} <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
