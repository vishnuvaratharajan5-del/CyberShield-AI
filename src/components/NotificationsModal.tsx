import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Info,
  Check,
  X
} from 'lucide-react';
import { SecurityNotification } from '../types';
import { api } from '../lib/api';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SecurityNotification[];
  onRefresh: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      onRefresh();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      onRefresh();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = (notif: SecurityNotification) => {
    handleMarkAsRead(notif.id);
    if (notif.category === 'INCIDENT') {
      onNavigateTab('incidents');
    } else if (notif.category === 'VULNERABILITY') {
      onNavigateTab('vulnerabilities');
    } else if (notif.category === 'THREAT') {
      onNavigateTab('threat-analyzer');
    } else if (notif.category === 'AWARENESS') {
      onNavigateTab('awareness');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Security Alerts & Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-xs p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto space-y-2 flex-1">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No notifications at this time.</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                  notif.isRead
                    ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-950 border-slate-700/80 text-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    {notif.type === 'CRITICAL' ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    ) : notif.type === 'WARNING' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    )}
                    <span className="truncate">{notif.title}</span>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
                  )}
                </div>

                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{notif.message}</p>
                <span className="block text-[10px] text-slate-500 mt-2 font-mono">
                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {notif.category}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
