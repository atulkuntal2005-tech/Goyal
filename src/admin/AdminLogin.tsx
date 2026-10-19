import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/apiBridge';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('jgoyal@gmail.com');
  const [password, setPassword] = useState('Admin@Goyal2025');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-[#ede8df] flex flex-col justify-center items-center px-4 py-12">
      <button
        onClick={onBackToSite}
        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#dfc499] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Public Website</span>
      </button>

      <div className="w-full max-w-md bg-[#12141c] rounded-3xl p-8 sm:p-10 border border-[#c5a880]/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#dfc499]/10 text-[#dfc499] flex items-center justify-center mx-auto border border-[#dfc499]/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#fbf7ee]">
            Admin CMS Portal
          </h1>
          <p className="text-xs text-[#a8a195]">
            Shri Goyal Associates Management System
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#ded8cd] space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-[#dfc499] font-medium">
            Pre-Configured Admin Credentials
          </div>
          <div className="font-mono text-white/90">
            Email: <span className="text-[#dfc499]">jgoyal@gmail.com</span>
          </div>
          <div className="font-mono text-white/90">
            Password: <span className="text-[#dfc499]">Admin@Goyal2025</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#ded8cd] mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8c8577] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#ded8cd] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8c8577] absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#191c24] rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#8c8577] hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs uppercase tracking-wider font-semibold text-black bg-[#dfc499] hover:bg-[#c5a880] rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
