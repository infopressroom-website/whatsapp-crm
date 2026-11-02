import { useState } from 'react';
import {
  MessageCircle, Mail, Lock, User, Eye, EyeOff, ArrowRight,
  Check, Phone, Building2, Loader2, AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { seedUserData } from '@/lib/seed';

type AuthMode = 'login' | 'signup';

const DEMO_CREDENTIALS = [
  { email: 'riya@whatsappbiz.com', password: 'demo1234', name: 'Riya Sharma' },
  { email: 'admin@store.com', password: 'admin1234', name: 'Admin User' },
];

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    setError('');
    setInfo('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim().toLowerCase(),
      password: loginPassword,
    });
    if (authError) {
      setLoading(false);
      setError(authError.message.includes('Invalid login')
        ? 'Invalid email or password. Try a demo account below, or sign up for a new account.'
        : authError.message);
      return;
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { name: name.trim(), company: company.trim() } },
    });
    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }
    if (data.user) {
      setInfo('Creating your account and seeding demo data...');
      await seedUserData(data.user.id);
      setLoading(false);
      setInfo('Account ready! You can now sign in.');
      setMode('login');
      setPassword('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and password.');
        return;
      }
      handleLogin(email, password);
    } else {
      handleSignup(e);
    }
  };

  const quickDemoLogin = async (cred: typeof DEMO_CREDENTIALS[0]) => {
    setError('');
    setInfo('');
    setEmail(cred.email);
    setPassword(cred.password);
    setMode('login');
    setLoading(true);
    setInfo(`Signing in as ${cred.name}...`);

    // Try to sign in first (works if account already exists)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: cred.email,
      password: cred.password,
    });

    if (!signInError) return; // Success — onAuthStateChange will pick up the session

    // Account doesn't exist yet — create it with auto-confirmed email
    setInfo('First time setup — creating demo account & seeding data...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: cred.email,
      password: cred.password,
      options: { data: { name: cred.name } },
    });

    if (signUpError) {
      setLoading(false);
      setInfo('');
      setError(`Failed to create demo account: ${signUpError.message}`);
      return;
    }

    if (signUpData.user) {
      // Seed demo data for the new user
      await seedUserData(signUpData.user.id);

      // If signUp returned a session (auto-confirm enabled), we're already logged in
      if (signUpData.session) return;

      // Otherwise sign out the interim session and sign in properly
      await supabase.auth.signOut();
      setInfo('Signing in...');
      const { error: secondSignInError } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password,
      });

      if (secondSignInError) {
        setLoading(false);
        setInfo('');
        setError(`Account created but login failed: ${secondSignInError.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-whatsapp-500 to-whatsapp-700 p-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full" />
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">WhatsApp Business</span>
        </div>

        <div className="relative flex-1 flex flex-col justify-center max-w-md">
          <h1 className="text-3xl font-bold leading-tight">
            {mode === 'login' ? 'Welcome back to your dashboard' : 'Start your WhatsApp business journey'}
          </h1>
          <p className="text-whatsapp-50/80 text-base mt-3 leading-relaxed">
            Manage campaigns, chat with customers, automate replies, and grow your business — all from one powerful dashboard.
          </p>
          <div className="space-y-3 mt-8">
            {[
              'Broadcast campaigns to thousands of contacts',
              'Real-time live chat with team collaboration',
              'Smart automation flows & AI quick replies',
              'Detailed analytics & performance tracking',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm text-whatsapp-50/90">{feat}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-sm text-whatsapp-50/60">
          © 2026 WhatsApp Business Hub. All rights reserved.
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-whatsapp-500 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">WhatsApp Business</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); setInfo(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === 'login' ? 'bg-whatsapp-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setInfo(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === 'signup' ? 'bg-whatsapp-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {mode === 'login'
              ? 'Enter your credentials to access your dashboard'
              : 'Get started with WhatsApp Business in minutes'}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          {info && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-whatsapp-50 border border-whatsapp-100 text-sm text-whatsapp-700 flex items-center gap-2 animate-fade-in-up">
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" /> {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <InputField icon={User} label="Full Name" value={name} onChange={setName} placeholder="Riya Sharma" required />
                <InputField icon={Building2} label="Company" value={company} onChange={setCompany} placeholder="Your store" />
              </div>
            )}

            <InputField icon={Mail} label="Email Address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" required />

            {mode === 'signup' && (
              <InputField icon={Phone} label="Phone Number" value={phone} onChange={setPhone} placeholder="+91 98765 43210" type="tel" />
            )}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  className="w-full border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50 transition"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-whatsapp-500 focus:ring-whatsapp-400" />
                  Remember me
                </label>
                <button type="button" className="text-sm text-whatsapp-600 font-medium hover:underline">Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-whatsapp-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-whatsapp-600 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</>
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Demo credentials — one click to auto-create + login */}
          {mode === 'login' && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-1 text-center">Quick Demo Login</p>
              <p className="text-[11px] text-slate-400 mb-3 text-center">Click a card to instantly sign in — account is auto-created on first use</p>
              <div className="space-y-2">
                {DEMO_CREDENTIALS.map((c) => (
                  <button
                    key={c.email}
                    onClick={() => quickDemoLogin(c)}
                    disabled={loading}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-whatsapp-200 hover:shadow-sm transition text-left group disabled:opacity-60"
                  >
                    <div className="w-8 h-8 rounded-full bg-whatsapp-100 text-whatsapp-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.email} · {c.password}</p>
                    </div>
                    {loading ? (
                      <Loader2 className="w-4 h-4 text-whatsapp-500 animate-spin shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-whatsapp-500 group-hover:translate-x-0.5 transition shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-center text-sm text-slate-400 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setInfo(''); }} className="text-whatsapp-600 font-semibold hover:underline">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon: Icon, label, value, onChange, placeholder, type = 'text', required,
}: {
  icon: React.ElementType; label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:border-whatsapp-500 focus:ring-2 focus:ring-whatsapp-50 transition"
        />
      </div>
    </div>
  );
}
