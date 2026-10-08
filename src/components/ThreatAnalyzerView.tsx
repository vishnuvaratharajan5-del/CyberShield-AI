import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Send,
  Loader2,
  History,
  FileWarning,
  Sparkles,
  Info,
  CheckCircle2,
  Copy,
  Check,
  PhoneCall,
  MessageSquare,
  Mail,
  Share2,
  Globe,
  Briefcase,
  RotateCcw
} from 'lucide-react';
import { ThreatAnalysisResponse, ThreatInputType, User } from '../types';
import { api } from '../lib/api';

interface ThreatAnalyzerViewProps {
  currentUser: User | null;
  history: ThreatAnalysisResponse[];
  onRefreshHistory: () => void;
  onNavigateToIncident: (incidentId?: string) => void;
}

export const ThreatAnalyzerView: React.FC<ThreatAnalyzerViewProps> = ({
  currentUser,
  history,
  onRefreshHistory,
  onNavigateToIncident,
}) => {
  const [inputType, setInputType] = useState<ThreatInputType>('URL');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<ThreatAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalatedIncidentId, setEscalatedIncidentId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const executeAnalysis = async (textToScan: string, typeToScan: ThreatInputType) => {
    if (!textToScan.trim()) {
      setErrorMessage('Please provide a URL, email, message, phone number, or text to analyze.');
      return;
    }
    setErrorMessage(null);
    setIsAnalyzing(true);
    setEscalatedIncidentId(null);

    try {
      const result = await api.threats.analyze(textToScan.trim(), typeToScan);
      setCurrentResult(result);
      onRefreshHistory();
    } catch (err: any) {
      if (err.status === 429) {
        setErrorMessage('Rate limit reached. Please wait a moment before trying again.');
      } else {
        setErrorMessage(err.message || 'Failed to complete threat analysis.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualAnalyze = () => {
    executeAnalysis(content, inputType);
  };

  const handleEscalateToIncident = async () => {
    if (!currentResult) return;
    setIsEscalating(true);
    try {
      const incident = await api.threats.createIncidentFromThreat(
        currentResult.id,
        'Escalated directly from Threat Analyzer by analyst user.'
      );
      setEscalatedIncidentId(incident.id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to escalate threat to incident response.');
    } finally {
      setIsEscalating(false);
    }
  };

  const handleCopyExplanation = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(
      `[CyberShield AI Threat Report]\nThreat Type: ${currentResult.threatType}\nRisk Level: ${currentResult.riskLevel} (Score: ${currentResult.riskScore}/100)\n\nExplanation:\n${currentResult.explanation}\n\nIndicators:\n${currentResult.indicators.map(i => `• ${i}`).join('\n')}\n\nRecommendations:\n${currentResult.recommendations.map(r => `• ${r}`).join('\n')}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* High-Tech Cyber Hero Banner with Visual */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 p-6 lg:p-8 space-y-3 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                AI Threat Intelligence Engine
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Trained Heuristic Signatures Active
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Phishing, Scam & Cyber Threat Scanner
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Analyze suspicious phone numbers, SMS smishing lures, phishing emails, fraudulent WhatsApp messages, and deceptive URLs with real-time heuristic validation and instant defensive recommendations.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Zero-False-Negative Defense</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>120 Scans / Min Capacity</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 h-48 lg:h-full relative overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-800">
            <img
              src="/src/assets/images/threat_shield_scan_1790411373237.jpg"
              alt="Cyber Threat Scanner"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Manual Input Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        {/* Input Type Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['URL', 'EMAIL', 'SMS', 'WHATSAPP', 'PHONE', 'TEXT'] as ThreatInputType[]).map((type) => {
              const Icon =
                type === 'PHONE'
                  ? PhoneCall
                  : type === 'EMAIL'
                  ? Mail
                  : type === 'SMS'
                  ? MessageSquare
                  : type === 'WHATSAPP'
                  ? Share2
                  : type === 'URL'
                  ? Globe
                  : Briefcase;

              return (
                <button
                  key={type}
                  onClick={() => setInputType(type)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                    inputType === type
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {type}
                </button>
              );
            })}
          </div>

          <span className="text-xs text-slate-500 font-mono">
            {content.length} characters
          </span>
        </div>

        {/* Text Area */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              inputType === 'PHONE'
                ? 'Enter telephone number or caller ID to scan (e.g. personal mobile, +91 98765 43210, +1 (415) 555-2671, or suspected spam number)...'
                : inputType === 'SMS'
                ? 'Paste SMS message with courier links, bank alerts, or urgent actions...'
                : inputType === 'EMAIL'
                ? 'Paste full email subject and body text to inspect for invoice fraud or credential phishing...'
                : inputType === 'WHATSAPP'
                ? 'Paste WhatsApp message text (e.g. "Hi Mum lost my phone", crypto giveaways, Telegram tasks)...'
                : inputType === 'URL'
                ? 'Enter suspicious URL to inspect (e.g. http://secure-login-chase-update.top/auth)...'
                : 'Enter message, communication payload, or script to analyze for threat markers...'
            }
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y font-mono leading-relaxed"
          />
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Dual-Engine: High-speed heuristic signatures & Gemini AI classification.</span>
          </div>

          <div className="flex items-center gap-2">
            {content && (
              <button
                onClick={() => {
                  setContent('');
                  setCurrentResult(null);
                }}
                className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
            <button
              onClick={handleManualAnalyze}
              disabled={isAnalyzing || !content.trim()}
              className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors flex items-center gap-2 shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Threat...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Analyze Threat Now
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Analysis Result Card */}
      {currentResult && (
        <div
          className={`border rounded-2xl p-6 transition-all shadow-xl animate-fadeIn ${
            currentResult.riskLevel === 'DANGEROUS'
              ? 'bg-red-950/20 border-red-500/40'
              : currentResult.riskLevel === 'SUSPICIOUS'
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-emerald-950/20 border-emerald-500/30'
          }`}
        >
          {/* Top Result Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                  currentResult.riskLevel === 'DANGEROUS'
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : currentResult.riskLevel === 'SUSPICIOUS'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                }`}
              >
                {currentResult.riskLevel === 'DANGEROUS' ? (
                  <ShieldAlert className="w-8 h-8" />
                ) : currentResult.riskLevel === 'SUSPICIOUS' ? (
                  <AlertTriangle className="w-8 h-8" />
                ) : (
                  <ShieldCheck className="w-8 h-8" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border uppercase ${
                      currentResult.riskLevel === 'DANGEROUS'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : currentResult.riskLevel === 'SUSPICIOUS'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {currentResult.riskLevel}
                  </span>
                  <span className="text-sm font-mono font-bold text-white">
                    {currentResult.threatType}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Confidence: {(currentResult.confidence * 100).toFixed(0)}% · Analysis ID: {currentResult.id}
                </p>
              </div>
            </div>

            {/* Risk Score Gauge Metric */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] uppercase font-semibold text-slate-400 block font-mono">
                  Threat Risk Score
                </span>
                <span
                  className={`text-3xl font-extrabold font-mono ${
                    currentResult.riskScore >= 65
                      ? 'text-red-400'
                      : currentResult.riskScore >= 35
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {currentResult.riskScore}
                  <span className="text-xs text-slate-500">/100</span>
                </span>
              </div>
              <button
                onClick={handleCopyExplanation}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                title="Copy threat report summary"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="my-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Threat Intelligence Assessment:
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 font-sans">
              {currentResult.explanation}
            </p>
          </div>

          {/* Indicators & Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Indicators */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h5 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2.5 ${
                currentResult.riskLevel === 'SAFE' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {currentResult.riskLevel === 'SAFE' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
                {currentResult.riskLevel === 'SAFE' ? 'Verified Safety Signals' : 'Detected Threat Signatures'} ({currentResult.indicators.length})
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentResult.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`${currentResult.riskLevel === 'SAFE' ? 'text-emerald-400' : 'text-amber-400'} font-bold shrink-0`}>
                      {currentResult.riskLevel === 'SAFE' ? '✓' : '›'}
                    </span>
                    <span className="leading-relaxed">{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {currentResult.riskLevel === 'SAFE' ? 'Recommended Contact Guidance' : 'Recommended Defensive Actions'}
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Escalation Workflow Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-mono">
              SOC Pipeline: Content Analysis → Heuristics → Incident Escalation
            </span>

            {escalatedIncidentId ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Incident Logged ({escalatedIncidentId})
                </span>
                <button
                  onClick={() => onNavigateToIncident(escalatedIncidentId)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  Open in Incident Desk
                </button>
              </div>
            ) : currentResult.riskLevel !== 'SAFE' ? (
              <button
                onClick={handleEscalateToIncident}
                disabled={isEscalating}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isEscalating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileWarning className="w-3.5 h-3.5" />
                )}
                Escalate to Incident Response Center
              </button>
            ) : (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Clean & Safe - No Incident Escalation Required</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Threat History Audit Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Threat Analysis History & Audit Log ({history.length} Records)
            </h3>
          </div>
          <button
            onClick={onRefreshHistory}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Refresh Logs
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-2.5 font-semibold">Risk Level</th>
                <th className="pb-2.5 font-semibold">Classification</th>
                <th className="pb-2.5 font-semibold">Content Snippet</th>
                <th className="pb-2.5 font-semibold">Score</th>
                <th className="pb-2.5 font-semibold">Timestamp</th>
                <th className="pb-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {history.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        t.riskLevel === 'DANGEROUS'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : t.riskLevel === 'SUSPICIOUS'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {t.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 font-semibold text-indigo-300">
                    {t.threatType}
                  </td>
                  <td className="py-3 max-w-xs truncate text-slate-200" title={t.inputContent}>
                    {t.inputContent}
                  </td>
                  <td className="py-3 font-bold text-white tabular-nums">
                    {t.riskScore}/100
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setCurrentResult(t)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-sans font-medium"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
