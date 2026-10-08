/**
 * CyberShield AI - Domain Type Definitions
 */

export type UserRole = 'USER' | 'SECURITY_ANALYST' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  lastLogin?: string;
  mfaEnabled: boolean;
}

export type ThreatRiskLevel = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS' | 'UNKNOWN';
export type ThreatType = 
  | 'PHISHING' 
  | 'SCAM' 
  | 'MALICIOUS_URL' 
  | 'IMPERSONATION' 
  | 'CREDENTIAL_HARVESTING' 
  | 'SPAM_CALL'
  | 'VISHING'
  | 'SAFE' 
  | 'UNKNOWN';

export type ThreatInputType = 'URL' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'TEXT' | 'PHONE';

export interface ThreatAnalysisResponse {
  id: string;
  inputType: ThreatInputType;
  inputContent: string;
  threatType: ThreatType;
  riskLevel: ThreatRiskLevel;
  riskScore: number; // 0-100
  confidence: number; // 0.0 - 1.0
  explanation: string;
  indicators: string[];
  recommendations: string[];
  createdAt: string;
  analyzedByUserId?: string;
}

export type VulnerabilitySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type VulnerabilityStatus = 'OPEN' | 'IN_PROGRESS' | 'MITIGATED' | 'CLOSED';

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  asset: string;
  severity: VulnerabilitySeverity;
  cveId: string;
  cvssScore: number; // 0.0 - 10.0
  status: VulnerabilityStatus;
  discoveredDate: string;
  dueDate: string;
  assignedAnalyst: string;
  assignedAnalystId?: string;
  remediationNotes: string;
  createdAt: string;
  updatedAt: string;
}

export type IncidentCategory = 
  | 'PHISHING'
  | 'ACCOUNT_COMPROMISE'
  | 'MALWARE'
  | 'DATA_BREACH'
  | 'CYBERBULLYING'
  | 'SUSPICIOUS_ACTIVITY'
  | 'UNAUTHORIZED_ACCESS'
  | 'OTHER';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 
  | 'NEW'
  | 'ACKNOWLEDGED'
  | 'INVESTIGATING'
  | 'CONTAINED'
  | 'RESOLVED'
  | 'CLOSED';

export interface IncidentAiAnalysis {
  threatType: string;
  severity: IncidentSeverity;
  attackTechnique: string;
  possibleImpact: string[];
  recommendedActions: string[];
}

export interface Incident {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  category: IncidentCategory;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedAnalyst?: string;
  assignedAnalystId?: string;
  investigationNotes: string[];
  resolution?: string;
  aiAnalysis?: IncidentAiAnalysis;
  relatedThreatId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CyberbullyingClassification = 
  | 'SAFE'
  | 'TOXIC'
  | 'HARASSMENT'
  | 'CYBERBULLYING'
  | 'THREAT'
  | 'HATE_SPEECH';

export type CyberbullyingSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CyberbullyingAnalysisResponse {
  classification: CyberbullyingClassification;
  severity: CyberbullyingSeverity;
  confidence: number;
  explanation: string;
  recommendedAction: 'REPORT' | 'BLOCK' | 'ESCALATE' | 'NO_ACTION';
  flags: string[];
}

export interface CyberbullyingReport {
  id: string;
  userId?: string;
  reporterName: string;
  isAnonymous: boolean;
  platform: 'TWITTER_X' | 'INSTAGRAM' | 'WHATSAPP' | 'DISCORD' | 'EMAIL' | 'OTHER';
  contentSnippet: string;
  classification: CyberbullyingClassification;
  severity: CyberbullyingSeverity;
  confidence: number;
  description: string;
  evidenceNote?: string;
  status: 'PENDING_REVIEW' | 'UNDER_INVESTIGATION' | 'ACTION_TAKEN' | 'DISMISSED';
  createdAt: string;
}

export interface PasswordAnalysisResult {
  strength: 'VERY_WEAK' | 'WEAK' | 'MEDIUM' | 'STRONG' | 'VERY_STRONG';
  score: number; // 0 - 100
  entropy: number;
  estimatedTimeToCrack: string;
  feedback: string[];
  warnings: string[];
  passedChecks: {
    length: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    noCommonWords: boolean;
    noRepetition: boolean;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface AwarenessModule {
  id: string;
  moduleNumber: number;
  title: string;
  category: string;
  description: string;
  durationMinutes: number;
  keyPoints: string[];
  learningContent: string;
  resourceLinks: string[];
  questions: QuizQuestion[];
  isCompleted?: boolean;
  userScore?: number;
  completedAt?: string;
}

export interface SecurityScoreFactors {
  authenticationSecurity: number; // 20%
  passwordSecurity: number;       // 20%
  awarenessCompletion: number;    // 20%
  threatReporting: number;        // 15%
  securityActivity: number;       // 15%
  accountProtection: number;      // 10%
  totalScore: number;
}

export type NotificationType = 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';

export interface SecurityNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: 'VULNERABILITY' | 'INCIDENT' | 'THREAT' | 'CYBERBULLYING' | 'AWARENESS' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  result: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details: string;
  createdAt: string;
}

export interface DashboardSummary {
  securityScore: number;
  threatsDetected: number;
  openIncidents: number;
  criticalVulnerabilities: number;
  phishingAttempts: number;
  cyberbullyingReports: number;
  passwordRiskLevel: 'SAFE' | 'MEDIUM' | 'HIGH';
  awarenessCompletionPercentage: number;
  systemHealth: 'SECURE' | 'ATTENTION_REQUIRED' | 'CRITICAL';
  threatDistribution: {
    safe: number;
    suspicious: number;
    dangerous: number;
  };
  threatCategories: {
    category: string;
    count: number;
  }[];
  threatTimeline: {
    date: string;
    count: number;
  }[];
  vulnerabilitySeverityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: string;
  description: string;
  requiresAuth: boolean;
  sampleBody?: any;
}

export interface BackendHealthStatus {
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  server: string;
  version: string;
  port: number;
  uptimeSeconds: number;
  environment: string;
  nodeVersion: string;
  memoryUsageMb: number;
  aiEngine: {
    provider: string;
    geminiConfigured: boolean;
    heuristicFallback: boolean;
  };
  database: {
    type: string;
    connected: boolean;
    recordsCount: {
      users: number;
      threats: number;
      vulnerabilities: number;
      incidents: number;
      cyberbullyingReports: number;
      awarenessModules: number;
      quizResults: number;
      notifications: number;
      auditLogs: number;
    };
  };
  endpoints: ApiEndpointSpec[];
}

export interface DatabaseTablesData {
  users: any[];
  threats: any[];
  vulnerabilities: any[];
  incidents: any[];
  cyberbullying: any[];
  awarenessModules: any[];
  notifications: any[];
  auditLogs: any[];
}
