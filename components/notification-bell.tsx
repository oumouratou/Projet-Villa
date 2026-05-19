"use client"

import { Bell, Calendar, AlertTriangle, Info, CheckCheck, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { backendAPI } from "@/lib/backend-api"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Notification {
  id: string
  type: string
  data: {
    message: string
    type?: string
    reservation_id?: number
    reclamation_id?: number
  }
  read_at: string | null
  created_at: string
}

export function NotificationBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { data } = await backendAPI.get("/notifications")
      // Ensure we have an array
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await backendAPI.post(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await backendAPI.post('/notifications/mark-all-read')
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      )
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read_at).length

  const getNotificationLink = (notification: Notification) => {
    const resId = notification.data.reservation_id
    const recId = notification.data.reclamation_id
    const role = user?.role

    if (resId) {
      return role === 'agent' ? '/agent/reservations' : '/client/reservations'
    }
    if (recId) {
      return role === 'agent' ? '/agent/reclamations' : '/client/reclamations'
    }
    return '#'
  }

  const getNotificationIcon = (notification: Notification) => {
    const type = notification.data.type || notification.type
    if (type.includes('Reservation') || notification.data.reservation_id) {
      return (
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
          <Calendar className="h-4 w-4" />
        </div>
      )
    }
    if (type.includes('Reclamation') || type.includes('Complaint') || notification.data.reclamation_id) {
      return (
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg dark:bg-amber-900/30 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )
    }
    return (
      <div className="p-2 bg-slate-50 text-slate-600 rounded-lg dark:bg-slate-900/30 dark:text-slate-400">
        <Info className="h-4 w-4" />
      </div>
    )
  }

  const safeFormatDistance = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Récemment"
      return formatDistanceToNow(date, { addSuffix: true, locale: fr })
    } catch {
      return "Récemment"
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-sky-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 transition-all duration-200"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute right-0 top-full mt-3 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-200">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">{unreadCount} non lues</p>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead} 
                  className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Tout lire
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
                  <Bell className="h-8 w-8 mb-2 stroke-1" />
                  <p className="text-sm">Aucune notification pour le moment</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Link
                    href={getNotificationLink(notification)}
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`flex items-start gap-3 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      !notification.read_at ? "bg-sky-50/20 dark:bg-sky-950/10" : ""
                    }`}
                  >
                    {getNotificationIcon(notification)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm text-slate-800 dark:text-slate-200 ${!notification.read_at ? "font-semibold" : ""}`}>
                        {notification.data.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {safeFormatDistance(notification.created_at)}
                      </p>
                    </div>
                    {!notification.read_at && (
                      <span className="h-2 w-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                    )}
                  </Link>
                ))
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <button 
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors" 
                onClick={fetchNotifications}
                disabled={loading}
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              <span className="text-[10px] text-slate-400 font-mono">ImmoGestion</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

