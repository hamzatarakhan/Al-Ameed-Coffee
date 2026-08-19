import React, { createContext, useContext, useState } from 'react';
import { notifications as seedNotifications, type Notification } from './mock-data';

interface NotificationsValue {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsValue | null>(null);

// Shared (not per-screen) state — the list screen, the detail screen, and
// Home's unread badge all need to agree on read/unread, so it can't live as
// local useState on any one of them.
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState(seedNotifications);

  const markRead = (id: string) => setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setNotifications((list) => list.map((n) => ({ ...n, read: true })));

  return <NotificationsContext.Provider value={{ notifications, markRead, markAllRead }}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
