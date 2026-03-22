import { createContext } from "react";

export interface Notification {
  id: string,
  title: string,
  message: string,
  icon: string,
  read: boolean,
  createdAt: string,
  actionUrl?: string
  data: {
    senderName?: string,
    postTitle?: string,
    replyContent?: string,
    commentContent?: string,
    avatarUrl?: string
  }
}

export interface NotificationContextType {
  notifications: Notification[],
  unreadCount: number,
  markAsRead: (id: string) => void,
  clearNotifications: () => void
}

export const NotificationContext = createContext<NotificationContextType | null>(null);