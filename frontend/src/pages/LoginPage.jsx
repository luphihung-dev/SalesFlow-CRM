import { ArrowRight, BarChart3, CheckCircle2 } from 'lucide-react';
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

  const signIn = async (credentials) => {
    setError('');
    setSubmitting(true);
    try {
      const session = await crmApi.auth.login(credentials);
      authStorage.setSession(session);
      navigate('/dashboard', { replace: true });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to sign in.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    signIn(form);
  };

  return (
    <main className="grid min-h-screen bg-ink text-cream lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden border-r border-white/10 bg-[linear-gradient(135deg,#17201A_0%,#233425_58%,#2F3C27_100%)] p-10 xl:p-12 lg:block">
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-clay shadow-card">
              <BarChart3 size={22} />
            </div>
            <span className="font-display text-2xl font-bold">Cedar CRM</span>
          </div>

          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-sand/60">Pipeline command center</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] xl:text-6xl">Turn customer operations into measurable revenue flow.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-sand/70">
              A focused CRM workspace for account context, pipeline discipline, follow-up ownership, and backend automation visibility.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-white/10 bg-cream p-5 text-ink shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-moss">Pipeline</p>
                  <h2 className="mt-1 font-display text-2xl font-bold">$126k active</h2>
                </div>
                <span className="rounded-full bg-pine px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-cream">Live</span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ['New', '28%', 'bg-clay'],
                  ['Contacted', '44%', 'bg-moss'],
                  ['Qualified', '68%', 'bg-pine']
                ].map(([label, width, color]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between text-sm font-extrabold">
                      <span>{label}</span>
                      <span className="text-ink/50">{width}</span>
                    </div>
                    <div className="h-2 rounded-full bg-ink/10">
                      <div className={`h-2 rounded-full ${color}`} style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-soft backdrop-blur">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sand/50">Automation signals</p>
              <div className="mt-5 space-y-4">
                {[
                  'New customers receive follow-up tasks',
                  'High-value deals surface manager notes',
                  'Closed tasks write activity history'
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-cream/10 text-sand">
                      <CheckCircle2 size={17} />
                    </span>
                    <p className="text-sm font-bold leading-6 text-sand/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-4 py-8 sm:px-6 sm:py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-[30rem] rounded-2xl bg-cream p-5 text-ink shadow-soft sm:p-8">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-clay text-cream shadow-card">
              <BarChart3 size={22} />
            </div>
            <div>
              <p className="font-display text-xl font-bold">Cedar CRM</p>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-moss">Revenue OS</p>
            </div>
          </div>
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-moss">Secure workspace</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Sign in</h2>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Access the CRM with role-based permissions, activity history, and automation-backed workflows.
          </p>
          <div className="mt-5">
            <ErrorBanner message={error} onDismiss={() => setError('')} />
          </div>

          <label className="mt-8 block text-sm font-extrabold text-ink" htmlFor="email">Email</label>
          <input
            id="email"
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="mt-2 h-12 w-full rounded-xl border border-ink/10 bg-white px-4 font-semibold outline-none ring-pine/20 focus:ring-4"
            placeholder="you@company.com"
          />

          <label className="mt-5 block text-sm font-extrabold text-ink" htmlFor="password">Password</label>
          <input
            id="password"
            required
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="mt-2 h-12 w-full rounded-xl border border-ink/10 bg-white px-4 font-semibold outline-none ring-pine/20 focus:ring-4"
            placeholder="••••••••"
          />

          <button
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-pine font-extrabold text-cream shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Enter dashboard'} <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
