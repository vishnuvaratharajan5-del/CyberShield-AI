import React, { useState, useEffect, useCallback } from 'react';
import {
  Server,
  Activity,
  Database,
  Terminal,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Send,
  Code2,
  Shield,
  Layers,
  Cpu,
  Clock,
  Play,
  Copy,
  Check,
  FileJson,
  FolderTree,
  RotateCcw
} from 'lucide-react';
import { BackendHealthStatus, ApiEndpointSpec, DatabaseTablesData } from '../types';
import { api } from '../lib/api';

export const BackendConnectionView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'explorer' | 'database' | 'integration' | 'telemetry'>('explorer');
  const [status, setStatus] = useState<BackendHealthStatus | null>(null);
  const [dbTables, setDbTables] = useState<DatabaseTablesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // API Explorer state
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointSpec | null>(null);
  const [customRequestBody, setCustomRequestBody] = useState<string>('{}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    data: any;
    error?: string;
  } | null>(null);
  const [endpointCategoryFilter, setEndpointCategoryFilter] = useState<string>('ALL');
  const [endpointSearch, setEndpointSearch] = useState<string>('');

  // Database inspector state
  const [selectedTable, setSelectedTable] = useState<keyof DatabaseTablesData>('vulnerabilities');
  const [tableSearch, setTableSearch] = useState<string>('');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Load Status and Ping
  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.backend.getStatus();
      setStatus(data);
      if (!selectedEndpoint && data.endpoints && data.endpoints.length > 0) {
        setSelectedEndpoint(data.endpoints[0]);
        if (data.endpoints[0].sampleBody) {
          setCustomRequestBody(JSON.stringify(data.endpoints[0].sampleBody, null, 2));
        }
      }
    } catch (err) {
      console.error('Failed to load backend status:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEndpoint]);

  const runPing = async () => {
    try {
      setIsPinging(true);
      const res = await api.backend.ping();
      setPingLatency(res.latencyMs);
    } catch (err) {
      console.error('Ping failed:', err);
      setPingLatency(null);
    } finally {
      setIsPinging(false);
    }
  };

  const loadDbTables = async () => {
    try {
      const data = await api.backend.getDbTables();
      setDbTables(data);
    } catch (err) {
      console.error('Failed to load DB tables:', err);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Are you sure you want to re-seed the backend database? This will restore pristine enterprise demo datasets.')) {
      return;
    }
    try {
      setIsResetting(true);
      const res = await api.backend.resetDb();
      setResetSuccessMessage(res.message);
      await fetchStatus();
      await loadDbTables();
      setTimeout(() => setResetSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Database reset error: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    runPing();
    loadDbTables();
    const interval = setInterval(() => {
      runPing();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectEndpoint = (ep: ApiEndpointSpec) => {
    setSelectedEndpoint(ep);
    setExecutionResult(null);
    if (ep.sampleBody) {
      setCustomRequestBody(JSON.stringify(ep.sampleBody, null, 2));
    } else {
      setCustomRequestBody('{}');
    }
  };

  const handleExecuteRequest = async () => {
    if (!selectedEndpoint) return;
    setIsExecuting(true);
    setExecutionResult(null);
    const start = performance.now();

    try {
      let bodyData: any = undefined;
      if (selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT') {
        try {
          bodyData = JSON.parse(customRequestBody);
        } catch {
          throw new Error('Invalid JSON format in Request Body');
        }
      }

      // Replace route parameters if any (e.g. :id)
      let resolvedPath = selectedEndpoint.path;
      if (resolvedPath.includes(':id')) {
        resolvedPath = resolvedPath.replace(':id', 'VULN-2026-001');
      }

      const res = await api.backend.rawRequest(selectedEndpoint.method, resolvedPath, bodyData);
      const durationMs = Math.round(performance.now() - start);

      setExecutionResult({
        status: 200,
        statusText: 'OK',
        durationMs,
        data: res,
      });
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - start);
      setExecutionResult({
        status: err.status || 400,
        statusText: err.status === 401 ? 'Unauthorized' : (err.status === 404 ? 'Not Found' : 'Error'),
        durationMs,
        data: err.data || null,
        error: err.message || 'API request execution failed',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Filter endpoints
  const filteredEndpoints = (status?.endpoints || []).filter((ep) => {
    const matchesCategory =
      endpointCategoryFilter === 'ALL' ||
      ep.category.toUpperCase() === endpointCategoryFilter.toUpperCase();
    const matchesSearch =
      ep.path.toLowerCase().includes(endpointSearch.toLowerCase()) ||
      ep.description.toLowerCase().includes(endpointSearch.toLowerCase()) ||
      ep.category.toLowerCase().includes(endpointSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const endpointCategories = Array.from(
    new Set((status?.endpoints || []).map((e) => e.category))
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 space-y-6">
      {/* Top Banner & Control Station */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs font-mono mb-2">
            <Server className="w-3.5 h-3.5" />
            <span>Full-Stack Express API Engine • Port 3000</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Backend Services & API Explorer</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time backend telemetry, relational in-memory database inspection, and interactive REST playground.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Live Ping Button */}
          <button
            onClick={runPing}
            disabled={isPinging}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            title="Measure roundtrip HTTP latency to backend server"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-400 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Ping: {pingLatency !== null ? `${pingLatency} ms` : 'Testing...'}</span>
          </button>

          {/* Refresh State */}
          <button
            onClick={() => {
              fetchStatus();
              loadDbTables();
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            title="Refresh backend status"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Re-seed Database */}
          <button
            onClick={handleResetDb}
            disabled={isResetting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-900/40 text-xs text-red-300 hover:text-red-200 transition-colors font-medium"
            title="Reset and re-seed backend database with default enterprise records"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-red-400 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting DB...' : 'Reset & Re-Seed DB'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner if DB Reset */}
      {resetSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {/* Top 4 Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Express Server Engine */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Server Runtime</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">Express 4.21</div>
            <p className="text-xs text-slate-400 mt-0.5">Port {status?.port || 3000} • Node {status?.nodeVersion || 'v22'}</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Uptime: {status ? `${status.uptimeSeconds}s` : '...'}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Healthy
            </span>
          </div>
        </div>

        {/* Card 2: AI Threat Engine */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">AI Intelligence Core</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">Gemini 2.5 Flash</div>
            <p className="text-xs text-slate-400 mt-0.5">
              {status?.aiEngine.geminiConfigured ? 'Google GenAI SDK Connected' : 'Deterministic Heuristic Fallback Active'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Dual-Engine Pipeline</span>
            <span className="text-purple-400">Active</span>
          </div>
        </div>

        {/* Card 3: Database Engine */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Database Engine</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">Relational Store</div>
            <p className="text-xs text-slate-400 mt-0.5">
              {status ? Object.values(status.database.recordsCount).reduce((a, b) => a + b, 0) : 0} Total Records Tracked
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>8 Active Collections</span>
            <span className="text-emerald-400">Persisted</span>
          </div>
        </div>

        {/* Card 4: API Gateway */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Registered Endpoints</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">
              {status?.endpoints.length || 31} Endpoints
            </div>
            <p className="text-xs text-slate-400 mt-0.5">REST API • JWT Bearer Auth</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Sliding Rate Limiter</span>
            <span className="text-blue-400">Enforced</span>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('explorer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'explorer'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Interactive API Explorer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'database'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Inspector</span>
        </button>

        <button
          onClick={() => setActiveSubTab('integration')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'integration'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Connect Your Client (Guide)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'telemetry'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Server Telemetry & Architecture</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: INTERACTIVE API EXPLORER & PLAYGROUND              */}
      {/* ========================================================= */}
      {activeSubTab === 'explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Endpoints List */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-indigo-400" />
                <span>API Route Catalog ({filteredEndpoints.length})</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Live Routes</span>
            </div>

            {/* Filter and Search */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search endpoints (e.g. /threats, incidents)..."
                value={endpointSearch}
                onChange={(e) => setEndpointSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  onClick={() => setEndpointCategoryFilter('ALL')}
                  className={`px-2 py-1 rounded-md shrink-0 transition-colors ${
                    endpointCategoryFilter === 'ALL'
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({status?.endpoints.length || 0})
                </button>
                {endpointCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEndpointCategoryFilter(cat)}
                    className={`px-2 py-1 rounded-md shrink-0 transition-colors ${
                      endpointCategoryFilter === cat
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Endpoint Item Cards */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredEndpoints.map((ep) => {
                const isSelected = selectedEndpoint?.path === ep.path && selectedEndpoint?.method === ep.method;
                const methodBadgeColor =
                  ep.method === 'GET'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : ep.method === 'POST'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : ep.method === 'PUT'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30';

                return (
                  <button
                    key={`${ep.method}-${ep.path}`}
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-indigo-500/60 shadow-lg shadow-indigo-500/5'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${methodBadgeColor}`}>
                          {ep.method}
                        </span>
                        <span className="text-xs font-mono font-medium text-slate-200 truncate">
                          {ep.path}
                        </span>
                      </div>
                      {ep.requiresAuth && (
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                          Auth
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{ep.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Test Execution Console */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            {selectedEndpoint ? (
              <>
                {/* Endpoint Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {selectedEndpoint.method}
                      </span>
                      <span className="text-sm font-mono font-bold text-white">
                        {selectedEndpoint.path}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{selectedEndpoint.description}</p>
                  </div>

                  <button
                    onClick={handleExecuteRequest}
                    disabled={isExecuting}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 shrink-0"
                  >
                    {isExecuting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isExecuting ? 'Executing...' : 'Execute Request'}</span>
                  </button>
                </div>

                {/* Request Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      Request Specifications
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Category: {selectedEndpoint.category}
                    </span>
                  </div>

                  {/* Headers */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Content-Type:</span>
                      <span className="text-slate-300">application/json</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Authorization:</span>
                      <span className="text-slate-300">
                        {selectedEndpoint.requiresAuth ? 'Bearer <active_session_token>' : 'Optional'}
                      </span>
                    </div>
                  </div>

                  {/* Request Body (for POST / PUT) */}
                  {(selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT') && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-medium text-slate-300">Request Body (JSON Payload)</label>
                        <button
                          onClick={() => {
                            if (selectedEndpoint.sampleBody) {
                              setCustomRequestBody(JSON.stringify(selectedEndpoint.sampleBody, null, 2));
                            }
                          }}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300"
                        >
                          Load Sample Payload
                        </button>
                      </div>
                      <textarea
                        rows={6}
                        value={customRequestBody}
                        onChange={(e) => setCustomRequestBody(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  )}
                </div>

                {/* Live Response Output Window */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <FileJson className="w-3.5 h-3.5 text-emerald-400" />
                      Live Response Inspector
                    </span>
                    {executionResult && (
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {executionResult.durationMs}ms
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            executionResult.status >= 200 && executionResult.status < 300
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {executionResult.status} {executionResult.statusText}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    {executionResult ? (
                      <>
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() =>
                              copyToClipboard(
                                JSON.stringify(executionResult.data || executionResult.error, null, 2),
                                'response'
                              )
                            }
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Copy response JSON"
                          >
                            {copiedKey === 'response' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-slate-300 max-h-80 overflow-y-auto overflow-x-auto selection:bg-indigo-500/40">
                          {executionResult.error ? (
                            <span className="text-red-400">{executionResult.error}</span>
                          ) : (
                            JSON.stringify(executionResult.data, null, 2)
                          )}
                        </pre>
                      </>
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-600 font-mono">
                        Click "Execute Request" above to test this endpoint against the Express backend.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                Select an endpoint from the left catalog to start testing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DATABASE INSPECTOR & REAL-TIME TABLES              */}
      {/* ========================================================= */}
      {activeSubTab === 'database' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Relational Database Inspector</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect records currently held in the backend database store.
              </p>
            </div>

            {/* Table Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              {[
                { id: 'vulnerabilities', label: 'Vulnerabilities' },
                { id: 'incidents', label: 'Incidents' },
                { id: 'threats', label: 'Threats' },
                { id: 'users', label: 'Users' },
                { id: 'cyberbullying', label: 'Cyberbullying' },
                { id: 'awarenessModules', label: 'Modules' },
                { id: 'auditLogs', label: 'Audit Logs' },
              ].map((t) => {
                const count = dbTables ? (dbTables[t.id as keyof DatabaseTablesData] || []).length : 0;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTable(t.id as keyof DatabaseTablesData)}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                      selectedTable === t.id
                        ? 'bg-indigo-600 text-white font-semibold shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-300">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Search & Record Count */}
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              placeholder={`Search in ${selectedTable} table...`}
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="max-w-xs w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs font-mono text-slate-500">
              Table: <span className="text-indigo-400 font-bold">{selectedTable}</span>
            </span>
          </div>

          {/* Records Display */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            {dbTables && dbTables[selectedTable] && dbTables[selectedTable].length > 0 ? (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs text-slate-300 font-sans">
                  <thead className="bg-slate-900 text-[11px] font-mono text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800">
                    <tr>
                      {Object.keys(dbTables[selectedTable][0] || {})
                        .slice(0, 7)
                        .map((key) => (
                          <th key={key} className="py-2.5 px-4 font-semibold">
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {dbTables[selectedTable]
                      .filter((row: any) =>
                        JSON.stringify(row).toLowerCase().includes(tableSearch.toLowerCase())
                      )
                      .map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                          {Object.keys(row)
                            .slice(0, 7)
                            .map((key) => {
                              const val = row[key];
                              return (
                                <td key={key} className="py-2.5 px-4 max-w-[200px] truncate text-slate-300">
                                  {typeof val === 'object'
                                    ? JSON.stringify(val)
                                    : String(val !== undefined && val !== null ? val : '—')}
                                </td>
                              );
                            })}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500 font-mono">
                No records currently found in this database collection.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CLIENT INTEGRATION & CONNECT GUIDE                 */}
      {/* ========================================================= */}
      {activeSubTab === 'integration' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Connect Your Application to CyberShield Backend</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Connect external frontend clients, microservices, or custom scripts using standard HTTP REST requests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Snippet 1: JavaScript / TypeScript Fetch */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  JavaScript / TypeScript (Fetch API)
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `// 1. Authenticate & Obtain Token
const authRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'marcus.vance@cybershield.internal',
    password: 'Analyst@123'
  })
});
const { token } = await authRes.json();

// 2. Scan Threat with Dual-Engine AI
const scanRes = await fetch('/api/threats/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    content: 'https://verify-payroll-account.top/login',
    inputType: 'URL'
  })
});
const threatData = await scanRes.json();
console.log('Threat Risk Score:', threatData.riskScore);`,
                      'js-snippet'
                    )
                  }
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  {copiedKey === 'js-snippet' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`// 1. Authenticate & Obtain Token
const authRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'marcus.vance@cybershield.internal',
    password: 'Analyst@123'
  })
});
const { token } = await authRes.json();

// 2. Scan Threat with Dual-Engine AI
const scanRes = await fetch('/api/threats/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    content: 'https://verify-payroll-account.top/login',
    inputType: 'URL'
  })
});
const threatData = await scanRes.json();
console.log('Threat Risk Score:', threatData.riskScore);`}
              </pre>
            </div>

            {/* Snippet 2: cURL Command */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">cURL (Command Line)</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `# Health Check
curl -X GET http://localhost:3000/api/health

# Threat Analysis
curl -X POST http://localhost:3000/api/threats/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"content": "Urgent wire required", "inputType": "EMAIL"}'

# Fetch Incident Records
curl -X GET http://localhost:3000/api/incidents`,
                      'curl-snippet'
                    )
                  }
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  {copiedKey === 'curl-snippet' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`# 1. Health Check
curl -X GET http://localhost:3000/api/health

# 2. Threat Analysis
curl -X POST http://localhost:3000/api/threats/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"content": "Urgent wire transfer", "inputType": "EMAIL"}'

# 3. Fetch Incident Records
curl -X GET http://localhost:3000/api/incidents`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: ARCHITECTURE & TELEMETRY                           */}
      {/* ========================================================= */}
      {activeSubTab === 'telemetry' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Full-Stack Architecture & Environment Setup</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Underlying server specifications, memory footprints, and security design principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300">Memory Heap Usage</span>
              <div className="text-2xl font-bold font-mono text-white">
                {status?.memoryUsageMb || 0} MB
              </div>
              <p className="text-[11px] text-slate-500">Node.js process heap memory allocation</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300">Environment Target</span>
              <div className="text-2xl font-bold font-mono text-white uppercase">
                {status?.environment || 'development'}
              </div>
              <p className="text-[11px] text-slate-500">Vite Middlewares + Express Gateway</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300">API Gateway Protocol</span>
              <div className="text-2xl font-bold font-mono text-white">HTTP / REST</div>
              <p className="text-[11px] text-slate-500">JSON API with Bearer token authentication</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
