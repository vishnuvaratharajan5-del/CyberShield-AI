/**
 * CyberShield AI - REST API Client
 * Interacts with the backend via /api/* with JWT Authorization & error normalization
 */

import {
  User,
  ThreatAnalysisResponse,
  ThreatInputType,
  Vulnerability,
  Incident,
  IncidentCategory,
  IncidentSeverity,
  IncidentStatus,
  CyberbullyingAnalysisResponse,
  CyberbullyingReport,
  AwarenessModule,
  DashboardSummary,
  SecurityNotification,
  AuditLog,
  BackendHealthStatus,
  DatabaseTablesData
} from '../types';

const TOKEN_KEY = 'cybershield_auth_token';
const USER_KEY = 'cybershield_active_user';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Token management
export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredAuth = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): User | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.message || (typeof data === 'string' ? data : `Request failed with status ${response.status}`);
    throw new ApiError(response.status, errorMsg, data);
  }

  return data as T;
}

export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string, role?: string) => {
      const res = await apiRequest<{ token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });
      setStoredAuth(res.token, res.user);
      return res;
    },
    register: async (name: string, email: string, password: string, role: string) => {
      const res = await apiRequest<{ token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      setStoredAuth(res.token, res.user);
      return res;
    },
    me: async () => {
      return apiRequest<User>('/api/auth/me');
    },
    logout: async () => {
      try {
        await apiRequest('/api/auth/logout', { method: 'POST' });
      } finally {
        clearStoredAuth();
      }
    }
  },

  // Threat Detection
  threats: {
    analyze: async (content: string, inputType: ThreatInputType) => {
      return apiRequest<ThreatAnalysisResponse>('/api/threats/analyze', {
        method: 'POST',
        body: JSON.stringify({ content, inputType }),
      });
    },
    getHistory: async () => {
      return apiRequest<ThreatAnalysisResponse[]>('/api/threats/history');
    },
    getById: async (id: string) => {
      return apiRequest<ThreatAnalysisResponse>(`/api/threats/${id}`);
    },
    createIncidentFromThreat: async (threatId: string, notes?: string) => {
      return apiRequest<Incident>(`/api/threats/${threatId}/create-incident`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });
    }
  },

  // Vulnerability Management
  vulnerabilities: {
    getAll: async () => {
      return apiRequest<Vulnerability[]>('/api/vulnerabilities');
    },
    getById: async (id: string) => {
      return apiRequest<Vulnerability>(`/api/vulnerabilities/${id}`);
    },
    create: async (data: Partial<Vulnerability>) => {
      return apiRequest<Vulnerability>('/api/vulnerabilities', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: Partial<Vulnerability>) => {
      return apiRequest<Vulnerability>(`/api/vulnerabilities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return apiRequest<{ success: boolean; id: string }>(`/api/vulnerabilities/${id}`, {
        method: 'DELETE',
      });
    }
  },

  // Incident Management
  incidents: {
    getAll: async () => {
      return apiRequest<Incident[]>('/api/incidents');
    },
    getById: async (id: string) => {
      return apiRequest<Incident>(`/api/incidents/${id}`);
    },
    create: async (data: {
      category: IncidentCategory;
      title: string;
      description: string;
      severity: IncidentSeverity;
      relatedThreatId?: string;
    }) => {
      return apiRequest<Incident>('/api/incidents', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: {
      status?: IncidentStatus;
      severity?: IncidentSeverity;
      assignedAnalyst?: string;
      investigationNote?: string;
      resolution?: string;
    }) => {
      return apiRequest<Incident>(`/api/incidents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    runAiAnalysis: async (id: string) => {
      return apiRequest<Incident>(`/api/incidents/${id}/ai-analyze`, {
        method: 'POST',
      });
    }
  },

  // Cyberbullying Detection
  cyberbullying: {
    analyze: async (content: string) => {
      return apiRequest<CyberbullyingAnalysisResponse>('/api/cyberbullying/analyze', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
    report: async (data: {
      contentSnippet: string;
      platform: string;
      description: string;
      isAnonymous: boolean;
      evidenceNote?: string;
    }) => {
      return apiRequest<CyberbullyingReport>('/api/cyberbullying/report', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getReports: async () => {
      return apiRequest<CyberbullyingReport[]>('/api/cyberbullying/reports');
    },
    updateStatus: async (id: string, status: string) => {
      return apiRequest<CyberbullyingReport>(`/api/cyberbullying/reports/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    }
  },

  // Awareness Modules & Quizzes
  awareness: {
    getModules: async () => {
      return apiRequest<AwarenessModule[]>('/api/awareness/modules');
    },
    getModuleById: async (id: string) => {
      return apiRequest<AwarenessModule>(`/api/awareness/modules/${id}`);
    },
    submitQuiz: async (moduleId: string, answers: Record<string, string>) => {
      return apiRequest<{
        moduleId: string;
        score: number;
        totalQuestions: number;
        percentage: number;
        passed: boolean;
        correctAnswers: Record<string, string>;
        newSecurityScore: number;
      }>('/api/awareness/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ moduleId, answers }),
      });
    }
  },

  // Dashboard
  dashboard: {
    getSummary: async () => {
      return apiRequest<DashboardSummary>('/api/dashboard/summary');
    }
  },

  // Notifications
  notifications: {
    getAll: async () => {
      return apiRequest<SecurityNotification[]>('/api/notifications');
    },
    markAsRead: async (id: string) => {
      return apiRequest<SecurityNotification>(`/api/notifications/${id}/read`, {
        method: 'PUT',
      });
    },
    markAllAsRead: async () => {
      return apiRequest<{ success: boolean }>('/api/notifications/read-all', {
        method: 'PUT',
      });
    }
  },

  // Audit Logs
  audit: {
    getLogs: async () => {
      return apiRequest<AuditLog[]>('/api/audit-logs');
    }
  },

  // Backend Health, Telemetry & Database Management
  backend: {
    getStatus: async () => {
      return apiRequest<BackendHealthStatus>('/api/backend/status');
    },
    ping: async () => {
      const start = performance.now();
      const res = await apiRequest<{ status: string; timestamp: string; serverTime: number; port: number }>('/api/backend/ping');
      const latencyMs = Math.round(performance.now() - start);
      return { ...res, latencyMs };
    },
    getDbTables: async () => {
      return apiRequest<DatabaseTablesData>('/api/backend/db-tables');
    },
    resetDb: async () => {
      return apiRequest<{ success: boolean; message: string; recordsCount: any }>('/api/backend/reset-db', {
        method: 'POST',
      });
    },
    rawRequest: async (method: string, endpoint: string, body?: any) => {
      const options: RequestInit = { method };
      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }
      return apiRequest<any>(endpoint, options);
    }
  }
};
