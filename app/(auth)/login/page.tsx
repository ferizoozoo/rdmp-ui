'use client';

import { useState } from 'react';
import { login } from '@/app/lib/services/auth.service';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // TODO: the API should return proper error messages and we should display them here
      const result = await login(email, password);

      if (!result) {
        setError('Invalid email or password.');
        return;
      }

      localStorage.setItem('token', result);
      router.push('/');
    } catch {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-neutral-800">
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-neutral-500">RDMP</span>
        </div>
        <div>
          <p className="text-neutral-600 text-[11px] tracking-widest uppercase mb-6">
            Your learning path
          </p>
          <h2 className="text-5xl font-black text-neutral-100 tracking-tight leading-tight">
            Build skills.<br />
            Ship projects.<br />
            <span className="text-orange-500">Get hired.</span>
          </h2>
        </div>
        <div className="flex gap-6">
          <div className="border border-neutral-800 rounded-xl p-4 flex-1">
            <p className="text-2xl font-black text-neutral-100">6</p>
            <p className="text-xs text-neutral-500 mt-1">Months</p>
          </div>
          <div className="border border-neutral-800 rounded-xl p-4 flex-1">
            <p className="text-2xl font-black text-neutral-100">12+</p>
            <p className="text-xs text-neutral-500 mt-1">Skills</p>
          </div>
          <div className="border border-neutral-800 rounded-xl p-4 flex-1">
            <p className="text-2xl font-black text-neutral-100">4</p>
            <p className="text-xs text-neutral-500 mt-1">Projects</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-500">RDMP</span>
          </div>

          <h1 className="text-3xl font-black text-neutral-100 tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-500 mb-10">
            Sign in to continue your roadmap.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm
                           text-neutral-100 placeholder:text-neutral-600
                           focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30
                           transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
                  Password
                </label>
                <a href="#" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm
                           text-neutral-100 placeholder:text-neutral-600
                           focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30
                           transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-800
                         disabled:text-neutral-500 text-neutral-950 font-black text-sm
                         tracking-wide rounded-xl px-4 py-3 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>

          </form>

          <p className="text-xs text-neutral-600 text-center mt-8">
            Don&apos;t have an account?{' '}
            <a href="signup" className="text-orange-500 hover:text-orange-400 transition-colors">
              Sign up
            </a>
          </p>

        </div>
      </div>
    </main>
  );
}
