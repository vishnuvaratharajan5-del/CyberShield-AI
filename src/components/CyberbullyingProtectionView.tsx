import React, { useState } from 'react';
import {
  MessageSquareWarning,
  ShieldAlert,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  EyeOff,
  History,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { CyberbullyingAnalysisResponse, CyberbullyingReport, User } from '../types';
import { api } from '../lib/api';

interface CyberbullyingProtectionViewProps {
  currentUser: User | null;
  reports: CyberbullyingReport[];
  onRefreshReports: () => void;
}

const BULLYING_PRESETS = [
  {
    label: 'Physical Threat (Critical)',
    text: 'Watch your back when you leave the office today, we know which car you drive and you are going to pay for this.',
  },
  {
    label: 'Toxic Team Harassment (High)',
    text: 'You are completely useless, nobody wants you on this team, delete your account and never speak in this Discord again.',
  },
  {
    label: 'Name Calling & Insults (Medium)',
    text: 'You are an absolute clown and idiot for breaking the staging branch.',
  },
  {
    label: 'Healthy Professional Feedback (Safe)',
    text: 'I noticed a few bugs in the new authentication pull request. Let us sync on Zoom this afternoon to discuss refactoring the token storage.',
  },
];

export const CyberbullyingProtectionView: React.FC<CyberbullyingProtectionViewProps> = ({
  currentUser,
  reports,
  onRefreshReports,
}) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CyberbullyingAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confidential Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [platform, setPlatform] = useState('TWITTER_X');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reportDescription, setReportDescription] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string | null>(null);

  const canManageReports = currentUser?.role === 'SECURITY_ANALYST' || currentUser?.role === 'ADMIN';

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const res = await api.cyberbullying.analyze(content.trim());
      setAnalysisResult(res);
    } catch (err: any) {
      if (err.status === 429) {
        setErrorMessage('Rate limit reached (Max 10 analyses / minute). Please wait.');
      } else {
        setErrorMessage(err.message || 'Failed to analyze content.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmittingReport(true);

    try {
      await api.cyberbullying.report({
        contentSnippet: content.trim(),
        platform,
        description: reportDescription || 'Reported via Cyberbullying Protection module.',
        isAnonymous,
        evidenceNote,
      });
      setIsReportModalOpen(false);
      setReportSuccessMsg('Report submitted securely. Investigation ticket generated.');
      onRefreshReports();
      setTimeout(() => setReportSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit cyberbullying report.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: string) => {
    try {
      await api.cyberbullying.updateStatus(reportId, status);
      onRefreshReports();
    } catch (err: any) {
      alert(err.message || 'Failed to update report status.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cyberbullying & Digital Harassment Protection
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3" />
              Natural Language NLP
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detect online harassment, intimidation, hate speech, and physical threats with confidential evidence preservation and anonymous reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            disabled={!content.trim()}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            Submit Confidential Report
          </button>
        </div>
      </div>

      {reportSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{reportSuccessMsg}</span>
        </div>
      )}

      {/* Test Presets */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Demo Test Samples:
        </span>
        <div className="flex flex-wrap gap-2">
          {BULLYING_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setContent(preset.text);
                setAnalysisResult(null);
                setErrorMessage(null);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Analyzer Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Message or Comment Text:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Paste suspicious comment, chat message, social media mention, or communication snippet..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
            <span>Anonymous reporting supported. Privacy preserved.</span>
          </span>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Language...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Classify Behavior
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-400 text-xs mt-2">{errorMessage}</p>
        )}
      </div>

      {/* Analysis Result Card */}
      {analysisResult && (
        <div
          className={`border rounded-xl p-5 transition-all ${
            analysisResult.classification === 'THREAT' || analysisResult.classification === 'CYBERBULLYING'
              ? 'bg-red-950/20 border-red-500/40'
              : analysisResult.classification === 'TOXIC'
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-emerald-950/20 border-emerald-500/30'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  analysisResult.severity === 'CRITICAL' || analysisResult.severity === 'HIGH'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : analysisResult.severity === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {analysisResult.classification}
              </span>
              <span className="text-xs font-mono text-slate-300">
                Severity: {analysisResult.severity} · Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Action:</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-indigo-300">
                {analysisResult.recommendedAction}
              </span>
            </div>
          </div>

          <div className="my-3 text-xs">
            <p className="text-slate-200 leading-relaxed font-sans">{analysisResult.explanation}</p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Detected Signals:</span>
              {analysisResult.flags.map((flag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                >
                  {flag}
                </span>
              ))}
            </div>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center gap-1"
            >
              <FileCheck className="w-3.5 h-3.5" />
              File Confidential Report With This Snippet
            </button>
          </div>
        </div>
      )}

      {/* Reports Queue (For Analyst / Admin review, or user view) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            Cyberbullying Incident & Harassment Reports ({reports.length})
          </h3>
          <button
            onClick={onRefreshReports}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px] bg-slate-950/50">
                <th className="py-2.5 px-3 font-semibold">Report ID</th>
                <th className="py-2.5 px-3 font-semibold">Platform</th>
                <th className="py-2.5 px-3 font-semibold">Classification</th>
                <th className="py-2.5 px-3 font-semibold">Content Snippet</th>
                <th className="py-2.5 px-3 font-semibold">Reporter</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                {canManageReports && <th className="py-2.5 px-3 font-semibold text-right">Triage</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-indigo-400">{r.id}</td>
                  <td className="py-3 px-3 text-slate-300">{r.platform}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        r.classification === 'THREAT' || r.classification === 'CYBERBULLYING'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : r.classification === 'TOXIC'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {r.classification}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate text-slate-200" title={r.contentSnippet}>
                    {r.contentSnippet}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {r.isAnonymous ? '🕶️ Anonymous' : r.reporterName}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {r.status}
                    </span>
                  </td>
                  {canManageReports && (
                    <td className="py-3 px-3 text-right">
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateReportStatus(r.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-[11px] rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
                      >
                        <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                        <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                        <option value="ACTION_TAKEN">ACTION_TAKEN</option>
                        <option value="DISMISSED">DISMISSED</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confidential Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                Submit Confidential Harassment Report
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Submit Anonymously</span>
                    <span className="text-[11px] text-slate-400">
                      Your identity will not be linked to the incident record
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Digital Platform Origin</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="TWITTER_X">Twitter / X</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="DISCORD">Discord</option>
                  <option value="EMAIL">Email</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Content Snippet</label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="The harmful message or post..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Contextual Description & Frequency
                </label>
                <textarea
                  rows={2}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="e.g. Occurred repeatedly over past 3 weeks in project channel..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Evidence Notes (URLs, Handles, Timestamps)
                </label>
                <input
                  type="text"
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  placeholder="e.g. Channel #dev-ops, sender handle @bad_user"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  {isSubmittingReport ? 'Submitting...' : 'File Confidential Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
