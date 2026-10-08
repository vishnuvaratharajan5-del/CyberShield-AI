import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { ThreatAnalyzerView } from './components/ThreatAnalyzerView';
import { VulnerabilityCenterView } from './components/VulnerabilityCenterView';
import { IncidentResponseView } from './components/IncidentResponseView';
import { CyberbullyingProtectionView } from './components/CyberbullyingProtectionView';
import { PasswordSecurityView } from './components/PasswordSecurityView';
import { CyberAwarenessView } from './components/CyberAwarenessView';
import { AuditLogsView } from './components/AuditLogsView';
import { BackendConnectionView } from './components/BackendConnectionView';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';

import {
  User,
  UserRole,
  DashboardSummary,
  ThreatAnalysisResponse,
  Vulnerability,
  Incident,
  CyberbullyingReport,
  AwarenessModule,
  SecurityNotification,
  AuditLog
} from './types';
import { api } from './lib/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [targetIncidentId, setTargetIncidentId] = useState<string | null>(null);

  // Modals
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Domain data
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [threatHistory, setThreatHistory] = useState<ThreatAnalysisResponse[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [cyberbullyingReports, setCyberbullyingReports] = useState<CyberbullyingReport[]>([]);
  const [awarenessModules, setAwarenessModules] = useState<AwarenessModule[]>([]);
  const [notifications, setNotifications] = useState<SecurityNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Initialize Session
  const initSession = useCallback(async () => {
    try {
      const user = await api.auth.me();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all domain datasets
  const refreshAllData = useCallback(async () => {
    try {
      const [
        summaryRes,
        threatsRes,
        vulnsRes,
        incidentsRes,
        bullyingRes,
        modulesRes,
        notifsRes,
        logsRes,
      ] = await Promise.all([
        api.dashboard.getSummary().catch(() => null),
        api.threats.getHistory().catch(() => []),
        api.vulnerabilities.getAll().catch(() => []),
        api.incidents.getAll().catch(() => []),
        api.cyberbullying.getReports().catch(() => []),
        api.awareness.getModules().catch(() => []),
        api.notifications.getAll().catch(() => []),
        api.audit.getLogs().catch(() => []),
      ]);

      if (summaryRes) setDashboardData(summaryRes);
      setThreatHistory(threatsRes);
      setVulnerabilities(vulnsRes);
      setIncidents(incidentsRes);
      setCyberbullyingReports(bullyingRes);
      setAwarenessModules(modulesRes);
      setNotifications(notifsRes);
      setAuditLogs(logsRes);
    } catch (err) {
      console.error('Error fetching CyberShield datasets:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const start = async () => {
      await initSession();
      await refreshAllData();
    };
    start();
  }, [initSession, refreshAllData]);

  // Handle switching personas on the fly
  const handleSwitchRole = async (newRole: UserRole) => {
    try {
      const res = await api.auth.login('', '', newRole);
      setCurrentUser(res.user);
      await refreshAllData();
    } catch (err) {
      console.error('Failed to switch role persona:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setCurrentUser(null);
  };

  const handleNavigateToIncident = (incidentId?: string) => {
    if (incidentId) {
      setTargetIncidentId(incidentId);
    }
    setCurrentTab('incidents');
  };

  const openIncidentsCount = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  ).length;

  const criticalVulnsCount = vulnerabilities.filter(
    (v) => (v.severity === 'CRITICAL' || v.severity === 'HIGH') && v.status === 'OPEN'
  ).length;

  const systemHealth =
    criticalVulnsCount > 0 || openIncidentsCount > 3
      ? 'CRITICAL'
      : openIncidentsCount > 0
      ? 'ATTENTION_REQUIRED'
      : 'SECURE';

  // If not logged in, present full-page modern Login Page
  if (isLoading && !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Verifying CyberShield Zero-Trust Session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          refreshAllData();
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        openIncidentsCount={openIncidentsCount}
        criticalVulnsCount={criticalVulnsCount}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopBar
          currentTab={currentTab}
          currentUser={currentUser}
          notifications={notifications}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onNavigateTab={setCurrentTab}
          systemHealth={systemHealth}
        />

        {/* Content Region */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {isLoading && !dashboardData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Initializing CyberShield SOC Platform...</p>
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  summary={dashboardData}
                  recentThreats={threatHistory}
                  recentIncidents={incidents}
                  recentVulnerabilities={vulnerabilities}
                  onNavigateTab={setCurrentTab}
                  isLoading={isLoading}
                />
              )}

              {currentTab === 'threat-analyzer' && (
                <ThreatAnalyzerView
                  currentUser={currentUser}
                  history={threatHistory}
                  onRefreshHistory={refreshAllData}
                  onNavigateToIncident={handleNavigateToIncident}
                />
              )}

              {currentTab === 'vulnerabilities' && (
                <VulnerabilityCenterView
                  currentUser={currentUser}
                  vulnerabilities={vulnerabilities}
                  onRefresh={refreshAllData}
                />
              )}

              {currentTab === 'incidents' && (
                <IncidentResponseView
                  currentUser={currentUser}
                  incidents={incidents}
                  onRefresh={refreshAllData}
                  initialSelectedId={targetIncidentId}
                />
              )}

              {currentTab === 'cyberbullying' && (
                <CyberbullyingProtectionView
                  currentUser={currentUser}
                  reports={cyberbullyingReports}
                  onRefreshReports={refreshAllData}
                />
              )}

              {(currentTab === 'password-security' || currentTab === 'passwords') && (
                <PasswordSecurityView />
              )}

              {currentTab === 'awareness' && (
                <CyberAwarenessView
                  currentUser={currentUser}
                  modules={awarenessModules}
                  onRefreshModules={refreshAllData}
                  onRefreshDashboard={refreshAllData}
                />
              )}

              {currentTab === 'audit-logs' && (
                <AuditLogsView logs={auditLogs} onRefresh={refreshAllData} />
              )}

              {currentTab === 'backend-hub' && (
                <BackendConnectionView />
              )}
            </>
          )}
        </main>
      </div>

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onRefresh={refreshAllData}
        onNavigateTab={setCurrentTab}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          refreshAllData();
        }}
      />
    </div>
  );
}
