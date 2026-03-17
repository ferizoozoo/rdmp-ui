'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/app/lib/services/auth.service';

export default function SignupPage() {
  // const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
        debugger;
      const res = await register(form.email, form.password); 
      if (!res) {
        setError('Something went wrong.');
        return;
      }

      localStorage.setItem('token', res)
      router.push('/');
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Create an account</h1>
          <p className="text-sm text-zinc-400 mt-1">Sign up to get started with RDMP</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5
                         text-sm text-white placeholder:text-zinc-600
                         focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5
                         text-sm text-white placeholder:text-zinc-600
                         focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5
                         text-sm text-white placeholder:text-zinc-600
                         focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-400 bg-red-950/50 border border-red-900
                          rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 bg-white text-zinc-900 font-medium text-sm rounded-lg
                       py-2.5 hover:bg-zinc-100 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-zinc-500 text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-300 hover:text-white transition-colors">
            Log in
          </Link>
        </p>

      </div>
    </main>
  );
}