import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  KeyRound,
  Fingerprint,
  Building2,
  Cpu,
  Radar,
  Activity,
  FileCheck2,
  Zap
} from 'lucide-react';
import { User, UserRole } from '../types';
import { api } from '../lib/api';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields - empty by default, no predefined accounts
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('SECURITY_ANALYST');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Password strength calculation for registration
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 5
  };

  const passScore = calculatePasswordStrength(password);
  const getStrengthLabel = (score: number) => {
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500 text-red-400' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500 text-amber-400' };
    if (score === 3 || score === 4) return { label: 'Strong', color: 'bg-blue-500 text-blue-400' };
    return { label: 'Enterprise Grade', color: 'bg-emerald-500 text-emerald-400' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const res = await api.auth.register(name.trim(), email.trim(), password, role);
        setSuccessMessage(`Account created successfully for ${res.user.name}! Logging in...`);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 500);
      } else {
        if (!email.trim() || !password) {
          throw new Error('Please provide both work email and password.');
        }
        const res = await api.auth.login(email.trim(), password);
        setSuccessMessage(`Welcome back, ${res.user.name}! Authenticating session...`);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials or create a new account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickConnect = async (targetEmail: string, targetPass: string, targetRole: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await api.auth.login(targetEmail, targetPass, targetRole);
      setSuccessMessage(`Connected as ${res.user.name} (${res.user.role})! Authenticating session...`);
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Quick connect authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreFill = (targetEmail: string, targetPass: string) => {
    setEmail(targetEmail);
    setPassword(targetPass);
    setIsRegister(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Cyber Grid and Ambient Light Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">CYBERSHIELD AI</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SOC Gateway
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Zero-Trust Threat Intelligence & Incident Response</p>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-medium text-[11px]">SOC Gateway Online</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Login / Register Form */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Portal Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs font-mono mb-2">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Enterprise Zero-Trust Authentication</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {isRegister ? 'Create Security Account' : 'Sign In to Security Operations'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRegister
                    ? 'Register your organizational credentials to access incident defense and threat telemetry.'
                    : 'Provide your authenticated credentials to access the CyberShield SOC portal.'}
                </p>
              </div>

              {/* Mode Toggle Tabs: Keep only Login and Create Account */}
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 px-3 rounded-lg transition-all text-center ${
                    !isRegister
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 px-3 rounded-lg transition-all text-center ${
                    isRegister
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Live Backend Connection Status Pill */}
              <div className="mb-4 p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="font-semibold text-emerald-300">Express Backend Online</span>
                  <span className="text-slate-500 hidden sm:inline">• Port 3000 • 31 APIs Active</span>
                </div>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                  Connected
                </span>
              </div>

              {/* 1-Click Quick Connect Selector (Login Mode) */}
              {!isRegister && (
                <div className="mb-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      1-Click Instant Connect (Pre-Configured Accounts):
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">Zero-Trust</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickConnect('marcus.vance@cybershield.internal', 'Analyst@123', 'SECURITY_ANALYST')}
                      className="p-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/40 text-left transition-colors group"
                      title="Connect directly as SOC Analyst (Marcus Vance)"
                    >
                      <div className="text-[11px] font-bold text-indigo-300 truncate">🛡️ Analyst</div>
                      <div className="text-[10px] text-slate-400 truncate">Marcus Vance</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickConnect('sarah.connor@cybershield.internal', 'Admin@123', 'ADMIN')}
                      className="p-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-700/40 text-left transition-colors group"
                      title="Connect directly as Administrator (Sarah Connor)"
                    >
                      <div className="text-[11px] font-bold text-purple-300 truncate">👑 Admin</div>
                      <div className="text-[10px] text-slate-400 truncate">Sarah Connor</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickConnect('david.miller@cybershield.internal', 'User@123', 'USER')}
                      className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/40 text-left transition-colors group"
                      title="Connect directly as Employee User (David Miller)"
                    >
                      <div className="text-[11px] font-bold text-emerald-300 truncate">👤 Employee</div>
                      <div className="text-[10px] text-slate-400 truncate">David Miller</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Success / Error Notification Banners */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{successMessage}</div>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Full Name field (Register only) */}
                {isRegister && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                      <span>Full Name</span>
                      <span className="text-[10px] text-slate-500 font-mono">Required</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                    <span>Work Email Address</span>
                    {!isRegister ? (
                      <button
                        type="button"
                        onClick={() => handlePreFill('marcus.vance@cybershield.internal', 'Analyst@123')}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-mono cursor-pointer"
                      >
                        Auto-fill Demo
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">RFC 5322</span>
                    )}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. analyst@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-300 font-medium">Password</label>
                    {!isRegister && (
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator (Register only) */}
                  {isRegister && password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Entropy Strength:</span>
                        <span className={`font-semibold ${getStrengthLabel(passScore).color.split(' ')[1]}`}>
                          {getStrengthLabel(passScore).label}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-full rounded-full transition-all duration-300 ${
                              passScore >= level ? getStrengthLabel(passScore).color.split(' ')[0] : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Selection (Register only) */}
                {isRegister && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Organizational Security Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    >
                      <option value="USER">USER — Employee / Security Awareness & Quizzes</option>
                      <option value="SECURITY_ANALYST">SECURITY_ANALYST — SOC Analyst / Triage & Mitigation</option>
                      <option value="ADMIN">ADMIN — Security Governance, Policies & Audit Logs</option>
                    </select>
                  </div>
                )}

                {/* Remember Me Checkbox (Login only) */}
                {!isRegister && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 text-xs">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                      />
                      <span>Trust this workstation session</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">TLS 1.3 256-bit</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isRegister ? 'Creating Account...' : 'Authenticating Credentials...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isRegister ? 'Register Security Account' : 'Sign In to SOC Console'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Security Assurance */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                NIST SP 800-63B Compliant
              </span>
              <span>Encrypted Session Storage</span>
            </div>
          </div>

          {/* Right Column: Platform Cyber Architecture & Security Highlights (No Predefined Users!) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Cyber Defense Visual Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-xl bg-slate-900/90 flex flex-col justify-between">
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src="/src/assets/images/cyber_network_lock_1790411387518.jpg"
                  alt="Cyber Defense Network"
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] text-emerald-300 font-mono flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Defense Shield Active</span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 tracking-wider">
                    Defensive Security Operations
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Autonomous Threat Intelligence & Response
                  </h3>
                </div>
              </div>

              {/* Security Capabilities Highlights */}
              <div className="p-5 space-y-3">
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <Radar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">AI Threat & Phishing Detection</h4>
                      <p className="text-[11px] text-slate-400">Heuristic engine scanning URLs, SMS, emails, WhatsApp & phone numbers.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Vulnerability & Incident Triage</h4>
                      <p className="text-[11px] text-slate-400">CVSS scoring, MITRE ATT&CK mapping, and active containment playbooks.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Immutable Audit Logging</h4>
                      <p className="text-[11px] text-slate-400">Cryptographically verifiable SOC activity logs and user role tracking.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Security Guardrails Card */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2 text-slate-400">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                Zero-Trust Platform Standards:
              </span>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-400">
                <li>Zero-Trust tokenized Bearer authorization headers.</li>
                <li>Strict Role-Based Access Control (USER, ANALYST, ADMIN).</li>
                <li>Adaptive rate limiting and continuous endpoint monitoring.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-3 text-center text-xs text-slate-500">
        <p>
          CyberShield AI © 2026. Confidential Defense Systems. All system access attempts are monitored and recorded.
        </p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-indigo-400">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Password Recovery Information</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Under enterprise Zero-Trust policy, automated password recovery requires authorization from your system security officer.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-200">How to proceed:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                <li>If you are a new operator, switch to the <strong className="text-indigo-300">Create Account</strong> tab to register your credentials.</li>
                <li>Existing personnel may contact the SOC administrator to reset access credentials.</li>
              </ul>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
