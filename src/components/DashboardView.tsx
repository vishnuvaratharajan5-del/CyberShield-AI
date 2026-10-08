import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Bug,
  FileWarning,
  MessageSquareWarning,
  KeyRound,
  GraduationCap,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  Server
} from 'lucide-react';
import { DashboardSummary, Incident, ThreatAnalysisResponse, Vulnerability } from '../types';

interface DashboardViewProps {
  summary: DashboardSummary | null;
  recentThreats: ThreatAnalysisResponse[];
  recentIncidents: Incident[];
  recentVulnerabilities: Vulnerability[];
  onNavigateTab: (tab: string) => void;
  isLoading: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  recentThreats,
  recentIncidents,
  recentVulnerabilities,
  onNavigateTab,
  isLoading,
}) => {
  if (isLoading || !summary) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-28 bg-slate-900 rounded-xl border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-xl border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  const score = summary.securityScore;
  const health = summary.systemHealth;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Cyber SOC Hero Visual & Command Center */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/cybershield_soc_banner_1790411358877.jpg"
            alt="Cyber Security Operations Center"
            className="w-full h-full object-cover opacity-35 object-center mix-blend-luminosity filter contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-indigo-950/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SOC Operations Active · Zero-Trust Perimeter Enforced</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Cyber Threat Defense & SOC Console
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Unified threat response portal for autonomous detection of phishing, smishing, scam phone numbers, malicious URLs, and critical enterprise CVE vulnerabilities.
            </p>

            {/* Quick Management Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => onNavigateTab('threat-analyzer')}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Threat Analyzer</span>
              </button>
              <button
                onClick={() => onNavigateTab('incidents')}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 active:scale-95"
              >
                <FileWarning className="w-4 h-4 text-amber-400" />
                <span>Manage Incidents ({summary.openIncidents})</span>
              </button>
              <button
                onClick={() => onNavigateTab('vulnerabilities')}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 active:scale-95"
              >
                <Bug className="w-4 h-4 text-red-400" />
                <span>CVE Center ({summary.criticalVulnerabilities} Crit)</span>
              </button>
              <button
                onClick={() => onNavigateTab('awareness')}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 active:scale-95"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Security Training</span>
              </button>
              <button
                onClick={() => onNavigateTab('backend-hub')}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-2 active:scale-95"
                title="Inspect live backend connection, database records and API playground"
              >
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Backend & API Hub</span>
              </button>
            </div>
          </div>

          {/* Quick Posture Metric Card */}
          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 min-w-[240px] shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Enterprise Posture</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Optimal
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">{score}</span>
              <span className="text-xs text-slate-400 font-mono">/ 100 Health</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
              <div>
                <span className="text-slate-500 block">Critical CVEs</span>
                <span className="text-white font-mono font-semibold">{summary.criticalVulnerabilities} Critical</span>
              </div>
              <div>
                <span className="text-slate-500 block">Threat Level</span>
                <span className={`font-mono font-semibold ${health === 'CRITICAL' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {health.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Health Status Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
          health === 'CRITICAL'
            ? 'bg-red-950/30 border-red-500/40 text-red-200'
            : health === 'ATTENTION_REQUIRED'
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
        }`}
      >
        <div className="flex items-start md:items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
              health === 'CRITICAL'
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : health === 'ATTENTION_REQUIRED'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            }`}
          >
            {health === 'CRITICAL' ? (
              <ShieldAlert className="w-5 h-5" />
            ) : health === 'ATTENTION_REQUIRED' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {health === 'CRITICAL'
                  ? 'System Security Status: Critical Threats Active'
                  : health === 'ATTENTION_REQUIRED'
                  ? 'System Security Status: Attention Required'
                  : 'System Security Status: Healthy & Protected'}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  health === 'CRITICAL'
                    ? 'bg-red-500/20 border-red-500/40 text-red-300'
                    : health === 'ATTENTION_REQUIRED'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {health.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {health === 'CRITICAL'
                ? `${summary.criticalVulnerabilities} critical CVEs and ${summary.openIncidents} open incidents require immediate defensive action.`
                : health === 'ATTENTION_REQUIRED'
                ? `${summary.openIncidents} active incidents logged. Security training completion stands at ${summary.awarenessCompletionPercentage}%.`
                : 'No unmitigated critical vulnerabilities. Threat heuristics operating at optimal threshold.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('threat-analyzer')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Analyze Threat
          </button>
          <button
            onClick={() => onNavigateTab('incidents')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            View Incidents
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Security Score */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Security Score</span>
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
              Personalized
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">{score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2.5">
            Weighted across MFA, passphrases, quizzes, and incident reports.
          </p>
        </div>

        {/* Threats Detected */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Threats Analyzed</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {summary.threatsDetected}
            </span>
            <span className="text-[11px] text-red-400 font-mono">
              ({summary.threatDistribution.dangerous} High Risk)
            </span>
          </div>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {summary.threatDistribution.safe} Safe
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {summary.threatDistribution.suspicious} Susp.
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {summary.threatDistribution.dangerous} Danger
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('threat-analyzer')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium mt-2.5 flex items-center gap-1"
          >
            Launch Analyzer <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Open Incidents */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Incidents</span>
            <FileWarning className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {summary.openIncidents}
            </span>
            <span className="text-xs text-slate-400">in triage</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            {summary.openIncidents > 0
              ? 'SOC analyst review underway; AI impact analysis attached.'
              : 'All reported incidents contained or resolved.'}
          </p>
          <button
            onClick={() => onNavigateTab('incidents')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium mt-2.5 flex items-center gap-1"
          >
            Incident Queue <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Critical Vulnerabilities */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Critical CVEs</span>
            <Bug className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {summary.criticalVulnerabilities}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({summary.vulnerabilitySeverityCounts.high} High)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            CVSS 9.0–10.0 vulnerabilities tracked in perimeter assets.
          </p>
          <button
            onClick={() => onNavigateTab('vulnerabilities')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium mt-2.5 flex items-center gap-1"
          >
            Vulnerability Center <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Analytics Charts & Security Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Threat Distribution Donut & Metrics */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Threat Risk Distribution
                </h3>
                <p className="text-[11px] text-slate-500">Heuristic & AI classified breakdown</p>
              </div>
              <Activity className="w-4 h-4 text-slate-500" />
            </div>

            {/* Custom SVG Donut Chart */}
            <div className="flex items-center justify-center my-4 relative">
              <svg width="150" height="150" viewBox="0 0 42 42" className="rotate-[-90deg]">
                {/* Background Ring */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="4.5" />
                
                {/* Safe segment */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="4.5"
                  strokeDasharray={`${
                    summary.threatsDetected > 0
                      ? (summary.threatDistribution.safe / summary.threatsDetected) * 100
                      : 40
                  } 100`}
                  strokeDashoffset="0"
                />
                
                {/* Suspicious segment */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="4.5"
                  strokeDasharray={`${
                    summary.threatsDetected > 0
                      ? (summary.threatDistribution.suspicious / summary.threatsDetected) * 100
                      : 30
                  } 100`}
                  strokeDashoffset={`-${
                    summary.threatsDetected > 0
                      ? (summary.threatDistribution.safe / summary.threatsDetected) * 100
                      : 40
                  }`}
                />

                {/* Dangerous segment */}
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="4.5"
                  strokeDasharray={`${
                    summary.threatsDetected > 0
                      ? (summary.threatDistribution.dangerous / summary.threatsDetected) * 100
                      : 30
                  } 100`}
                  strokeDashoffset={`-${
                    summary.threatsDetected > 0
                      ? ((summary.threatDistribution.safe + summary.threatDistribution.suspicious) /
                          summary.threatsDetected) *
                        100
                      : 70
                  }`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-mono text-white tracking-tight">
                  {summary.threatsDetected}
                </span>
                <span className="text-[10px] text-slate-400">Total Scans</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 mt-4 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Safe Content
                </span>
                <span className="tabular-nums font-semibold">{summary.threatDistribution.safe}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Suspicious / Impersonation
                </span>
                <span className="tabular-nums font-semibold">{summary.threatDistribution.suspicious}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Dangerous Phishing & Scams
                </span>
                <span className="tabular-nums font-semibold">{summary.threatDistribution.dangerous}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Vulnerability Severity Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Vulnerability Severity
                </h3>
                <p className="text-[11px] text-slate-500">Active CVEs by CVSS score tier</p>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-500" />
            </div>

            {/* Severity Bars */}
            <div className="space-y-3.5 my-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-red-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Critical (CVSS 9.0–10.0)
                  </span>
                  <span className="font-mono text-slate-200">
                    {summary.vulnerabilitySeverityCounts.critical}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (summary.vulnerabilitySeverityCounts.critical / 5) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-amber-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> High (CVSS 7.0–8.9)
                  </span>
                  <span className="font-mono text-slate-200">
                    {summary.vulnerabilitySeverityCounts.high}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (summary.vulnerabilitySeverityCounts.high / 5) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-yellow-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium (CVSS 4.0–6.9)
                  </span>
                  <span className="font-mono text-slate-200">
                    {summary.vulnerabilitySeverityCounts.medium}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (summary.vulnerabilitySeverityCounts.medium / 5) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-blue-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Low (CVSS 0.1–3.9)
                  </span>
                  <span className="font-mono text-slate-200">
                    {summary.vulnerabilitySeverityCounts.low}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (summary.vulnerabilitySeverityCounts.low / 5) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Remediation Target SLA</span>
            <span className="font-mono text-emerald-400">92% Compliance</span>
          </div>
        </div>

        {/* Security Awareness & Hygiene Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Security Awareness & Posture
                </h3>
                <p className="text-[11px] text-slate-500">Employee cyber hygiene metrics</p>
              </div>
              <GraduationCap className="w-4 h-4 text-slate-500" />
            </div>

            <div className="space-y-4 my-2">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Training Modules Completed</span>
                  <span className="font-mono font-bold text-indigo-400">
                    {summary.awarenessCompletionPercentage}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${summary.awarenessCompletionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Password Risk Level</span>
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High Entropy
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Evaluated client-side; zero plaintext leakage.
                </p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Cyberbullying Protection</span>
                  <span className="font-mono text-slate-300">
                    {summary.cyberbullyingReports} Reports
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Natural language harassment & toxicity triage.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('awareness')}
            className="w-full py-2 text-xs font-semibold rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors flex items-center justify-center gap-1 mt-3"
          >
            Launch Cyber Awareness Center <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Security Activity Feeds (Threats + Incidents) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Analyzed Threats */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              Recent Threat Analyses
            </h3>
            <button
              onClick={() => onNavigateTab('threat-analyzer')}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              View all
            </button>
          </div>

          <div className="space-y-2.5">
            {recentThreats.slice(0, 3).map((threat) => (
              <div
                key={threat.id}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold border ${
                          threat.riskLevel === 'DANGEROUS'
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : threat.riskLevel === 'SUSPICIOUS'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {threat.riskLevel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{threat.threatType}</span>
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-1 font-mono">
                      {threat.inputContent}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {threat.explanation}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-white">
                      {threat.riskScore}/100
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {new Date(threat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents in Progress */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-orange-400" />
              Active Incident Response Queue
            </h3>
            <button
              onClick={() => onNavigateTab('incidents')}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              View all
            </button>
          </div>

          <div className="space-y-2.5">
            {recentIncidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">
                        {inc.id}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : inc.severity === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {inc.severity}
                      </span>
                      <span className="text-[10px] text-slate-400">· {inc.status}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 line-clamp-1">{inc.title}</p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {inc.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-400 block">
                      {inc.assignedAnalyst || 'Unassigned'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(inc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
