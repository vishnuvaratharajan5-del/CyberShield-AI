import React from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  Bug,
  FileWarning,
  MessageSquareWarning,
  KeyRound,
  GraduationCap,
  History,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Server,
  Users
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onSwitchRole?: (role: UserRole) => void;
  onLogout?: () => void;
  openIncidentsCount: number;
  criticalVulnsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onSwitchRole,
  onLogout,
  openIncidentsCount,
  criticalVulnsCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'threat-analyzer', label: 'Threat Analyzer', icon: ShieldAlert, badge: 'AI' },
    { id: 'vulnerabilities', label: 'Vulnerability Center', icon: Bug, badge: criticalVulnsCount > 0 ? `${criticalVulnsCount} Crit` : null },
    { id: 'incidents', label: 'Incident Response', icon: FileWarning, badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : null },
    { id: 'cyberbullying', label: 'Cyberbullying Defense', icon: MessageSquareWarning, badge: null },
    { id: 'password-security', label: 'Password Security', icon: KeyRound, badge: 'Offline' },
    { id: 'awareness', label: 'Awareness Modules', icon: GraduationCap, badge: '8 Mods' },
    { id: 'audit-logs', label: 'Security Audit Logs', icon: History, badge: null },
    { id: 'backend-hub', label: 'Backend & API Hub', icon: Server, badge: 'Connected' },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 backdrop-blur border-r border-slate-800 flex flex-col shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-indigo-500/30 bg-slate-950 flex items-center justify-center shadow-inner">
            <img
              src="/src/assets/images/cyber_shield_lock_1790411379151.jpg"
              alt="CyberShield AI"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">CyberShield</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Threat Response Platform</p>
          </div>
        </div>
      </div>

      {/* Role Switcher Pill Bar for Role Testing */}
      <div className="px-3 pt-3 pb-2 border-b border-slate-800/50 bg-slate-950/40">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            Role Preview
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            RBAC
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          {(['USER', 'SECURITY_ANALYST', 'ADMIN'] as UserRole[]).map((role) => {
            const isActive = currentUser?.role === role;
            const shortLabel = role === 'SECURITY_ANALYST' ? 'Analyst' : (role === 'ADMIN' ? 'Admin' : 'User');
            return (
              <button
                key={role}
                onClick={() => onSwitchRole?.(role)}
                className={`py-1 px-1.5 text-[11px] font-medium rounded transition-all text-center truncate ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`Switch active persona to ${role}`}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1.5 ${
                    item.badge.includes('Crit')
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-semibold'
                      : item.badge === 'AI'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Current Active Persona Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-indigo-300">
                {currentUser?.name.substring(0, 2).toUpperCase() || 'US'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">{currentUser?.name || 'Authorized User'}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.role === 'ADMIN' ? 'bg-amber-400' : currentUser?.role === 'SECURITY_ANALYST' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
              <span className="truncate capitalize">{currentUser?.role.replace('_', ' ').toLowerCase() || 'User'}</span>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
              title="Sign out to Login Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
