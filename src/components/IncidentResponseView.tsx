import React, { useState } from 'react';
import {
  FileWarning,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Send,
  Loader2,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Incident, IncidentCategory, IncidentSeverity, IncidentStatus, User } from '../types';
import { api } from '../lib/api';

interface IncidentResponseViewProps {
  currentUser: User | null;
  incidents: Incident[];
  onRefresh: () => void;
  initialSelectedId?: string | null;
}

const STATUS_STEPS: IncidentStatus[] = ['NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED'];

export const IncidentResponseView: React.FC<IncidentResponseViewProps> = ({
  currentUser,
  incidents,
  onRefresh,
  initialSelectedId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(() => {
    if (initialSelectedId) {
      return incidents.find((i) => i.id === initialSelectedId) || null;
    }
    return incidents[0] || null;
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');

  // Report Modal form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<IncidentCategory>('PHISHING');
  const [reportSeverity, setReportSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [reportDescription, setReportDescription] = useState('');

  const canManage = currentUser?.role === 'SECURITY_ANALYST' || currentUser?.role === 'ADMIN';

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.reporterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || inc.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusChange = async (incidentId: string, nextStatus: IncidentStatus) => {
    try {
      const updated = await api.incidents.update(incidentId, { status: nextStatus });
      onRefresh();
      setSelectedIncident(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to update incident status.');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedIncident) return;

    try {
      const updated = await api.incidents.update(selectedIncident.id, {
        investigationNote: newNote.trim(),
      });
      setNewNote('');
      onRefresh();
      setSelectedIncident(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to append investigation note.');
    }
  };

  const handleResolveIncident = async () => {
    if (!selectedIncident) return;
    try {
      const updated = await api.incidents.update(selectedIncident.id, {
        status: 'RESOLVED',
        resolution: resolutionNote.trim() || 'Remediation completed; verified system integrity.',
      });
      setResolutionNote('');
      onRefresh();
      setSelectedIncident(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to resolve incident.');
    }
  };

  const handleRunAiAnalysis = async (incidentId: string) => {
    setIsAiLoading(true);
    try {
      const updated = await api.incidents.runAiAnalysis(incidentId);
      onRefresh();
      setSelectedIncident(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to generate AI incident analysis.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDescription.trim()) return;
    setIsSubmitting(true);

    try {
      const created = await api.incidents.create({
        title: reportTitle.trim(),
        category: reportCategory,
        severity: reportSeverity,
        description: reportDescription.trim(),
      });
      setIsReportModalOpen(false);
      setReportTitle('');
      setReportDescription('');
      onRefresh();
      setSelectedIncident(created);
    } catch (err: any) {
      alert(err.message || 'Failed to submit incident report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Incident Response & Triage Center
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {incidents.length} Logged
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end incident lifecycle management from initial triage and MITRE ATT&CK AI copilot analysis to containment and resolution.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Report Incident
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, title, or reporter..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="PHISHING">Phishing</option>
            <option value="ACCOUNT_COMPROMISE">Account Compromise</option>
            <option value="MALWARE">Malware</option>
            <option value="DATA_BREACH">Data Breach</option>
            <option value="CYBERBULLYING">Cyberbullying</option>
            <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
            <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            {STATUS_STEPS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Two-Column Incident Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Incident List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col max-h-[780px]">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Incident Queue ({filtered.length})
            </span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-800/60 flex-1">
            {filtered.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/30 border-l-2 border-indigo-500'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-indigo-400">
                      {inc.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : inc.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{inc.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{inc.description}</p>

                  <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500 font-mono">
                    <span className="text-slate-400">{inc.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Incident Detail & SOC Copilot (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col space-y-5">
          {selectedIncident ? (
            <>
              {/* Incident Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {selectedIncident.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                        selectedIncident.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : selectedIncident.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {selectedIncident.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedIncident.category}
                    </span>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedIncident.status}
                        onChange={(e) =>
                          handleStatusChange(selectedIncident.id, e.target.value as IncidentStatus)
                        }
                        className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 font-mono"
                      >
                        {STATUS_STEPS.map((step) => (
                          <option key={step} value={step}>
                            {step}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mt-2">{selectedIncident.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Reported by <span className="text-slate-200">{selectedIncident.reporterName}</span> on{' '}
                  {new Date(selectedIncident.createdAt).toLocaleString()} · Analyst:{' '}
                  <span className="text-indigo-300 font-medium">
                    {selectedIncident.assignedAnalyst || 'Unassigned'}
                  </span>
                </p>
              </div>

              {/* Status Stepper */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[480px]">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIndex = STATUS_STEPS.indexOf(selectedIncident.status);
                    const isPassed = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-500/40'
                                : isPassed
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isPassed ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] font-mono mt-1 ${
                              isCurrent
                                ? 'text-indigo-400 font-bold'
                                : isPassed
                                ? 'text-slate-300'
                                : 'text-slate-600'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                        {idx < STATUS_STEPS.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-1 transition-all ${
                              idx < currentIndex ? 'bg-emerald-600' : 'bg-slate-800'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Incident Narrative:
                </span>
                <p className="text-slate-200 leading-relaxed font-sans">{selectedIncident.description}</p>
              </div>

              {/* AI Copilot Threat Analysis Card */}
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    AI Incident Threat Analysis Copilot
                  </div>
                  <button
                    onClick={() => handleRunAiAnalysis(selectedIncident.id)}
                    disabled={isAiLoading}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      'Refresh AI Analysis'
                    )}
                  </button>
                </div>

                {selectedIncident.aiAnalysis ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block">Classified Attack Technique</span>
                        <span className="text-indigo-300 font-medium">
                          {selectedIncident.aiAnalysis.attackTechnique}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Assessed Severity</span>
                        <span className="text-red-400 font-bold">
                          {selectedIncident.aiAnalysis.severity}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Possible Enterprise Impact:
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {selectedIncident.aiAnalysis.possibleImpact.map((imp, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-red-400">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                        Recommended Containment Actions:
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {selectedIncident.aiAnalysis.recommendedActions.map((act, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">✓</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    AI Copilot analysis pending. Click "Refresh AI Analysis" to synthesize findings.
                  </p>
                )}
              </div>

              {/* Investigation Notes Timeline */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Investigation Notes & Evidence Log
                </span>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedIncident.investigationNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono"
                    >
                      {note}
                    </div>
                  ))}
                </div>

                {canManage && (
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add analyst investigation note or forensic artifact..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Post
                    </button>
                  </form>
                )}
              </div>

              {/* Resolution Card if Resolved */}
              {selectedIncident.resolution && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3.5 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Formal Resolution Statement:
                  </span>
                  <p className="text-slate-300 font-sans">{selectedIncident.resolution}</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12">
              <FileWarning className="w-12 h-12 text-slate-700 mb-2" />
              <p className="text-xs">Select an incident from the queue to inspect details</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Incident Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileWarning className="w-4 h-4 text-indigo-400" />
                Report Cybersecurity Incident
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Incident Summary Title</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Unusual Outbound SMB Connections from Workstation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Incident Category</label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value as IncidentCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PHISHING">Phishing / Social Eng</option>
                    <option value="ACCOUNT_COMPROMISE">Account Compromise</option>
                    <option value="MALWARE">Malware / Ransomware</option>
                    <option value="DATA_BREACH">Data Breach / Leak</option>
                    <option value="CYBERBULLYING">Cyberbullying</option>
                    <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
                    <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Initial Severity</label>
                  <select
                    value={reportSeverity}
                    onChange={(e) => setReportSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Detailed Description & Forensic Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Provide chronological events, involved email addresses, IPs, hosts, or anomalous behaviors observed..."
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
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Incident Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
