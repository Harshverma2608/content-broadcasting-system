import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Radio, Mail, Lock, Eye, EyeOff, BookOpen, Users, Tv } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email:    z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const DEMO_ACCOUNTS = [
  { label: 'Harsh verma',  role: 'Teacher',    email: 'teacher@demo.com',   password: 'password' },
  { label: 'Ayush Verma',    role: 'Teacher',    email: 'teacher2@demo.com',  password: 'password' },
  { label: 'Khushboo madam ji',    role: 'Principal',  email: 'principal@demo.com', password: 'password' },
];

const FEATURES = [
  { icon: BookOpen, text: 'Upload & schedule educational content' },
  { icon: Users,    text: 'Principal approval workflow' },
  { icon: Tv,       text: 'Live broadcast with auto-rotation' },
];

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname;
      navigate(from || `/${user.role}/dashboard`, { replace: true });
    }
  }, [user, navigate, location]);

  const onSubmit = async ({ email, password }) => {
    try {
      const loggedIn = await login(email, password);
      toast.success(`Welcome back, ${loggedIn.name}!`);
      navigate(`/${loggedIn.role}/dashboard`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    }
  };

  const fillDemo = (account) => {
    setValue('email', account.email, { shouldValidate: false });
    setValue('password', account.password, { shouldValidate: false });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--navy-950) 0%, var(--navy-800) 55%, var(--navy-700) 100%)' }}
      >
        {/* decorative blobs */}
        <div
          className="absolute rounded-full opacity-[0.07] pointer-events-none"
          style={{ width: 520, height: 520, background: 'var(--navy-300)', top: '-120px', right: '-160px' }}
        />
        <div
          className="absolute rounded-full opacity-[0.05] pointer-events-none"
          style={{ width: 380, height: 380, background: 'var(--navy-400)', bottom: '-80px', left: '-100px' }}
        />

        {/* logo */}
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: 'var(--navy-600)' }}>
            <Radio className="h-6 w-6 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-wide" style={{ fontFamily: 'var(--font-oswald)' }}>
            ContentBroadcast
          </span>
        </div>

        {/* hero copy */}
        <div className="relative space-y-8">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--navy-300)' }}
            >
              Educational Broadcasting Platform
            </p>
            <h2
              className="text-4xl xl:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-unna)' }}
            >
              Broadcast knowledge,<br />
              <span style={{ fontFamily: 'var(--font-great)', fontSize: '1.15em', color: 'var(--navy-200)' }}>
                inspire minds.
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--navy-200)', maxWidth: 380 }}>
              A streamlined system for teachers to share content and principals
              to keep quality in check — all in one place.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg shrink-0" style={{ background: 'var(--navy-700)' }}>
                  <Icon className="h-4 w-4" style={{ color: 'var(--navy-200)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--navy-200)' }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* bottom tagline */}
        <p className="relative text-xs" style={{ color: 'var(--navy-500)' }}>
          © 2025 ContentBroadcast · Built for schools
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div
        className="flex-1 flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-24 min-h-screen lg:min-h-0"
        style={{ background: 'var(--color-bg)' }}
      >
        {/* mobile logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="p-2 rounded-xl" style={{ background: 'var(--navy-700)' }}>
            <Radio className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-base tracking-wide text-[var(--navy-800)]" style={{ fontFamily: 'var(--font-oswald)' }}>
            ContentBroadcast
          </span>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* heading */}
          <div className="mb-8">
            <h1
              className="text-2xl sm:text-3xl font-bold text-[var(--navy-800)]"
              style={{ fontFamily: 'var(--font-unna)' }}
            >
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Sign in to your account to continue
            </p>
          </div>

          {/* form card */}
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* email */}
              <div>
                <label className="block text-sm font-medium text-[var(--navy-700)] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--navy-300)] pointer-events-none" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@school.edu"
                    {...register('email')}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy-400)] transition-colors bg-white ${
                      errors.email
                        ? 'border-red-400 bg-red-50'
                        : 'border-[var(--color-border)] text-[var(--navy-800)]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* password */}
              <div>
                <label className="block text-sm font-medium text-[var(--navy-700)] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--navy-300)] pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy-400)] transition-colors bg-white ${
                      errors.password
                        ? 'border-red-400 bg-red-50'
                        : 'border-[var(--color-border)] text-[var(--navy-800)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--navy-300)] hover:text-[var(--navy-600)] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
                )}
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: loading ? 'var(--navy-500)' : 'var(--navy-700)' }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--navy-600)'; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--navy-700)'; }}
              >
                {loading ? (
                  <>
                    <span
                      className="h-4 w-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                    />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          {/* demo accounts */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-widest mb-3 text-center">
              Demo accounts — click to fill
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="group flex flex-col items-start gap-0.5 px-3.5 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--navy-300)] hover:bg-[var(--navy-50)] transition-all text-left"
                >
                  <span className="text-xs font-semibold text-[var(--navy-700)] group-hover:text-[var(--navy-800)] transition-colors">
                    {acc.label}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: acc.role === 'Principal' ? 'var(--navy-100)' : 'var(--navy-50)',
                      color: acc.role === 'Principal' ? 'var(--navy-700)' : 'var(--navy-500)',
                    }}
                  >
                    {acc.role}
                  </span>
                  <span className="text-xs text-[var(--color-muted)] mt-0.5 truncate w-full">{acc.email}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-[var(--color-muted)] mt-2">
              Password for all accounts: <span className="font-mono font-semibold text-[var(--navy-600)]">password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
