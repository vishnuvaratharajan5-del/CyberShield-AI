import React from 'react';
import {
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { User, SecurityNotification } from '../types';

interface TopBarProps {
  currentTab: string;
  currentUser: User | null;
  notifications: SecurityNotification[];
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateTab?: (tab: string) => void;
  systemHealth: 'SECURE' | 'ATTENTION_REQUIRED' | 'CRITICAL';
}

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Security Operations Dashboard',
  'threat-analyzer': 'AI Phishing & Threat Analyzer',
  vulnerabilities: 'Vulnerability Management Center',
  incidents: 'Incident Response & Investigation',
  cyberbullying: 'Cyberbullying & Harassment Protection',
  'password-security': 'Client-Side Password Security Vault',
  awareness: 'Cyber Awareness & Training Center',
  'audit-logs': 'System Security & Compliance Audit Logs',
  'backend-hub': 'Backend Services & REST API Explorer',
};

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  currentUser,
  notifications,
  onOpenNotifications,
  onOpenAuth,
  onLogout,
  onNavigateTab,
  systemHealth,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-14 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between z-10 shrink-0">
      {/* Zone 1: Breadcrumb & Title */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Platform</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <h1 className="text-sm font-semibold text-slate-100 truncate">
          {TAB_TITLES[currentTab] || 'CyberShield Operations'}
        </h1>
      </div>

      {/* Zone 2: System Health Badge & Search Bar */}
      <div className="hidden md:flex items-center gap-3">
        {/* Backend Connectivity Status Button */}
        <button
          onClick={() => onNavigateTab?.('backend-hub')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-[11px] text-emerald-300 hover:bg-emerald-900/40 transition-colors font-mono cursor-pointer"
          title="Express Backend Connected (Port 3000) — Click to open API Hub"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Backend: Connected</span>
        </button>

        {/* Real-time System Status Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
          {systemHealth === 'SECURE' && (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-medium text-[11px]">System Secure</span>
            </>
          )}
          {systemHealth === 'ATTENTION_REQUIRED' && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-400 font-medium text-[11px]">Attention Required</span>
            </>
          )}
          {systemHealth === 'CRITICAL' && (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-medium text-[11px]">Critical Alerts Active</span>
            </>
          )}
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search CVEs, incidents, threats..."
            className="w-56 bg-slate-950/70 border border-slate-800 rounded-md pl-8 pr-3 py-1 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
          />
        </div>
      </div>

      {/* Zone 3: Notification & Profile Actions */}
      <div className="flex items-center gap-3">
        {/* Export Project Source Button */}
        <a
          href="/api/export-project"
          download="cybershield-ai-source.zip"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          title="Export complete project source code for local execution"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Export Code</span>
        </a>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="Security notifications"
          title="Security Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center font-mono">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Profile / Logout */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <span className="text-xs font-medium text-slate-300 hidden sm:inline truncate max-w-32">
              {currentUser.name}
            </span>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors whitespace-nowrap"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
