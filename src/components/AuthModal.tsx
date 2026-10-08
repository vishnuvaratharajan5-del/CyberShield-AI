import React, { useState } from 'react';
import {
  Lock,
  User as UserIcon,
  Shield,
  X,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { User, UserRole } from '../types';
import { api } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isRegister) {
        const res = await api.auth.register(name, email, password, role);
        onAuthSuccess(res.user);
      } else {
        const res = await api.auth.login(email, password, role);
        onAuthSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              {isRegister ? 'Register Security Account' : 'Sign in to CyberShield AI'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {!isRegister && (
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">1-Click Quick Connect:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('marcus.vance@cybershield.internal');
                    setPassword('Analyst@123');
                  }}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700/80 text-[10px] text-indigo-300 hover:bg-slate-800 text-center font-mono"
                >
                  Analyst
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('sarah.connor@cybershield.internal');
                    setPassword('Admin@123');
                  }}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700/80 text-[10px] text-purple-300 hover:bg-slate-800 text-center font-mono"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('david.miller@cybershield.internal');
                    setPassword('User@123');
                  }}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700/80 text-[10px] text-emerald-300 hover:bg-slate-800 text-center font-mono"
                >
                  Employee
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Work Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@cybershield.internal"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="USER">USER (Individual / Employee)</option>
                <option value="SECURITY_ANALYST">SECURITY_ANALYST (SOC Operator)</option>
                <option value="ADMIN">ADMIN (Full Governance)</option>
              </select>
            </div>
          )}

          {errorMessage && (
            <div className="p-2.5 rounded bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isRegister ? 'Create Account' : 'Authenticate Session'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMessage(null);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {isRegister
              ? 'Already registered? Sign in instead'
              : 'Need a new account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};
