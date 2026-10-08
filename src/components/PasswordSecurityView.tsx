import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Zap,
  Info
} from 'lucide-react';
import { analyzePasswordLocally } from '../lib/passwordAnalyzer';
import { PasswordAnalysisResult } from '../types';

export const PasswordSecurityView: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedPassphrase, setGeneratedPassphrase] = useState('');
  const [passphraseLength, setPassphraseLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);

  const analysis: PasswordAnalysisResult = analyzePasswordLocally(password);

  // Generate cryptographic secure passphrase
  const generateSecurePassword = () => {
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()-_=+[]{}';

    let pool = lower + upper;
    if (includeNumbers) pool += numbers;
    if (includeSymbols) pool += symbols;

    const array = new Uint32Array(passphraseLength);
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < passphraseLength; i++) {
      result += pool[array[i] % pool.length];
    }

    setGeneratedPassphrase(result);
  };

  const handleCopyGenerated = () => {
    if (!generatedPassphrase) return;
    navigator.clipboard.writeText(generatedPassphrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseGenerated = () => {
    if (!generatedPassphrase) return;
    setPassword(generatedPassphrase);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Password Security & Cryptographic Vault
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3" />
              100% Local Offline Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate entropy, dictionary vulnerability, and GPU brute-force resistance without transmitting plaintext over any network or external AI.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero Server Telemetry Guarantee</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Password Strength Tester (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Test Password / Passphrase:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter or paste a candidate password..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-11 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Strength Meter Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Strength Rating:</span>
              <span
                className={`font-mono font-bold ${
                  analysis.strength === 'VERY_STRONG'
                    ? 'text-emerald-400'
                    : analysis.strength === 'STRONG'
                    ? 'text-teal-400'
                    : analysis.strength === 'MEDIUM'
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {analysis.strength.replace('_', ' ')} ({analysis.score}/100)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  analysis.score >= 85
                    ? 'bg-emerald-500'
                    : analysis.score >= 70
                    ? 'bg-teal-500'
                    : analysis.score >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${password ? analysis.score : 0}%` }}
              />
            </div>
          </div>

          {/* Shannon Entropy & Crack Time Metrics */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block font-mono">
                Shannon Entropy
              </span>
              <span className="text-base font-bold font-mono text-indigo-400">
                {analysis.entropy} bits
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {analysis.entropy >= 65 ? 'Cryptographically strong' : 'Low entropy state'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block font-mono">
                Brute-Force Resistance
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400 truncate block">
                {analysis.estimatedTimeToCrack}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Under high-density GPU attack
              </span>
            </div>
          </div>

          {/* Security Rule Checklist */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              Complexity & Hygiene Checklist:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div
                className={`flex items-center gap-2 p-2 rounded border ${
                  analysis.passedChecks.length
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {analysis.passedChecks.length ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                )}
                <span>12+ Characters</span>
              </div>

              <div
                className={`flex items-center gap-2 p-2 rounded border ${
                  analysis.passedChecks.hasUppercase
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {analysis.passedChecks.hasUppercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                )}
                <span>Uppercase (A-Z)</span>
              </div>

              <div
                className={`flex items-center gap-2 p-2 rounded border ${
                  analysis.passedChecks.hasLowercase
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {analysis.passedChecks.hasLowercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                )}
                <span>Lowercase (a-z)</span>
              </div>

              <div
                className={`flex items-center gap-2 p-2 rounded border ${
                  analysis.passedChecks.hasNumber
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {analysis.passedChecks.hasNumber ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                )}
                <span>Numbers (0-9)</span>
              </div>

              <div
                className={`flex items-center gap-2 p-2 rounded border ${
                  analysis.passedChecks.hasSpecial
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {analysis.passedChecks.hasSpecial ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                )}
                <span>Symbols (!@#$)</span>
              </div>

              <div
                className={`flex items-center gap-2 p-2 rounded border ${
                  analysis.passedChecks.noCommonWords
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-950/20 border-red-500/30 text-red-300'
                }`}
              >
                {analysis.passedChecks.noCommonWords ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                )}
                <span>No Dictionary Words</span>
              </div>
            </div>
          </div>

          {/* Feedback & Warnings */}
          {(analysis.warnings.length > 0 || analysis.feedback.length > 0) && (
            <div className="space-y-2 text-xs">
              {analysis.warnings.map((w, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-red-950/20 border border-red-500/30 text-red-300 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
              {analysis.feedback.map((f, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Passphrase Generator & Enterprise Standards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Cryptographic Passphrase Generator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                Secure Passphrase Generator
              </h3>
              <button
                onClick={generateSecurePassword}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                Generate
              </button>
            </div>

            {/* Generated display */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 relative">
              <span className="font-mono text-xs text-emerald-400 break-all select-all">
                {generatedPassphrase || 'Click generate to create cryptographic key...'}
              </span>
              {generatedPassphrase && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 justify-end">
                  <button
                    onClick={handleCopyGenerated}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                  <button
                    onClick={handleUseGenerated}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                  >
                    Test Above
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">Length ({passphraseLength} characters)</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={passphraseLength}
                  onChange={(e) => setPassphraseLength(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Include Numbers (0-9)</span>
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Include Special Symbols (!@#$)</span>
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>

              <button
                onClick={generateSecurePassword}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
              >
                Generate New Passphrase
              </button>
            </div>
          </div>

          {/* Enterprise Best Practices Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 text-xs space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              NIST SP 800-63B Password Baseline
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">›</span>
                <span>Length outperforms complexity: 16+ character passphrases resist GPU clusters better than 8-char complex passwords.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">›</span>
                <span>Do not force 30-day resets unless compromise is confirmed; forced resets encourage predictable number increments (e.g. Pass1! → Pass2!).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">›</span>
                <span>Always pair credentials with phishing-resistant FIDO2 hardware tokens.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
