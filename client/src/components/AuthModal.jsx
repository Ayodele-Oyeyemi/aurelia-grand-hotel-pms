import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function AuthModal({ isOpen, onClose, mode, setMode, onLogin }) {
  const [step, setStep] = useState('form'); // 'form' | 'verify'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sandboxCode, setSandboxCode] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reset = () => { setStep('form'); setError(''); setSandboxCode(null); setOtp(''); };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address.');
    if (mode === 'signup' && !name) return setError('Please enter your full name.');
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, phone, password, mode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');
      if (data.sandboxCode) setSandboxCode(data.sandboxCode);
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return setError('Please enter the 6-digit verification code.');
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      onLogin(data.user, data.token);
      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copySandboxCode = () => {
    if (sandboxCode) {
      navigator.clipboard.writeText(sandboxCode).catch(() => {});
      setCopied(true);
      setOtp(sandboxCode);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md theme-bg-elevated rounded-2xl border theme-border shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b theme-border">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold font-bold">The Aurelia Grand & Suites</p>
            <h2 className="text-xl font-serif-display font-semibold theme-text-primary mt-0.5">
              {step === 'verify' ? 'Verify Your Email' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
          </div>
          <button onClick={() => { onClose(); reset(); }} className="p-2 rounded-xl theme-text-secondary hover:text-gold hover:theme-bg-secondary transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium theme-text-secondary mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-text-muted" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Chidi Okafor"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium theme-text-secondary mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-text-muted" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
                </div>
              </div>
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium theme-text-secondary mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-text-muted" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234-801-555-0101"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium theme-text-secondary mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-text-muted" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 theme-text-muted cursor-pointer">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-3 rounded-xl bg-rose/10 border border-rose/30 text-rose text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-60">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending Code...</> : 'Send Verification Code'}
              </button>
              <p className="text-center text-xs theme-text-muted">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                  className="text-gold hover:underline font-semibold cursor-pointer">
                  {mode === 'login' ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm theme-text-secondary">
                We sent a 6-digit code to <span className="text-gold font-semibold">{email}</span>. Enter it below to verify.
              </p>

              {sandboxCode && (
                <div className="p-4 rounded-xl border border-amber/40 bg-amber/10">
                  <p className="text-xs font-bold text-amber uppercase tracking-wider mb-2">🧪 Developer Sandbox Code</p>
                  <p className="text-xs theme-text-secondary mb-2">SMTP not configured. Use this code to verify:</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono font-bold text-amber tracking-widest">{sandboxCode}</span>
                    <button type="button" onClick={copySandboxCode}
                      className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber/20 text-amber text-xs font-semibold cursor-pointer hover:bg-amber/30">
                      {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy & Fill'}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium theme-text-secondary mb-1.5">6-Digit Verification Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="1 2 3 4 5 6" maxLength={6}
                  className="w-full text-center text-3xl font-mono tracking-[0.5em] py-4 rounded-xl theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
              </div>
              {error && (
                <div className="p-3 rounded-xl bg-rose/10 border border-rose/30 text-rose text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}
              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-60">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying...</> : 'Verify & Access Account'}
              </button>
              <button type="button" onClick={() => { setStep('form'); setError(''); setSandboxCode(null); }}
                className="w-full text-xs theme-text-muted hover:text-gold cursor-pointer">
                ← Back / Resend code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
