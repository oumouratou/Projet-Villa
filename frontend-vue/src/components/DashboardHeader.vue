<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Calendar, AlertTriangle, Info, CheckCheck, RefreshCw, Check, X as XIcon } from 'lucide-vue-next'
import { 
  getNotificationSummary, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  type NotificationItem 
} from '@/lib/api'
import { getStoredToken, getStoredRole } from '@/lib/session'

defineProps<{ title?: string; subtitle?: string }>()
const router = useRouter()
const showNotifications = ref(false)

const isLoading = ref(false)
const notifications = ref<NotificationItem[]>([])
const unreadCount = computed(() => notifications.value.filter((item) => item.unread).length)

const formatTime = (iso?: string | null) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  
  const diffMs = new Date().getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Il y a ${diffHours} h`
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const fetchNotifications = async () => {
  if (!getStoredToken()) {
    notifications.value = []
    return
  }

  isLoading.value = true
  try {
    const summary = await getNotificationSummary()
    notifications.value = summary.notifications || []
  } catch {
    notifications.value = []
  } finally {
    isLoading.value = false
  }
}

const getNotificationLink = (notification: NotificationItem): string | null => {
  const role = getStoredRole()
  
  if (notification.reservation_id) {
    if (role === 'client') return `/client/reservations/${notification.reservation_id}`
    if (role === 'agent') return `/agent/reservations/${notification.reservation_id}`
    return `/admin/activites`
  }
  if (notification.reclamation_id) {
    if (role === 'client') return `/client/reclamations/${notification.reclamation_id}`
    if (role === 'agent') return `/agent/reclamations/${notification.reclamation_id}`
    return `/admin/activites`
  }
  // Fallback based on type
  if (notification.type === 'reservation') {
    if (role === 'client') return '/client/reservations'
    if (role === 'agent') return '/agent/reservations'
  }
  if (notification.type === 'reclamation') {
    if (role === 'client') return '/client/reclamations'
    if (role === 'agent') return '/agent/reclamations'
  }
  return null
}

const handleNotificationClick = async (notification: NotificationItem) => {
  // Mark as read
  if (notification.unread) {
    const idToUse = notification.db_id || String(notification.id)
    try {
      notification.unread = false
      await markNotificationAsRead(idToUse)
    } catch (error) {
      console.error("Failed to mark read:", error)
      notification.unread = true
    }
  }
  
  // Navigate to details
  const link = getNotificationLink(notification)
  if (link) {
    showNotifications.value = false
    router.push(link)
  }
}

const handleMarkAllAsRead = async () => {
  try {
    notifications.value.forEach(n => { n.unread = false })
    await markAllNotificationsAsRead()
  } catch (error) {
    console.error("Failed to mark all read:", error)
    await fetchNotifications()
  }
}

const getStatusBadge = (notification: NotificationItem) => {
  const s = notification.status
  if (!s) return null
  
  if (s === 'confirmee' || s === 'approuver') {
    return { text: s === 'confirmee' ? 'Confirmée' : 'Approuvée', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
  }
  if (s === 'refusee' || s === 'refuser') {
    return { text: s === 'refusee' ? 'Refusée' : 'Refusée', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
  }
  if (s === 'en_attente') {
    return { text: 'En attente', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
  }
  if (s === 'annulee') {
    return { text: 'Annulée', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' }
  }
  return null
}

// Auto-refresh every 30 seconds
let refreshInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  fetchNotifications()
  refreshInterval = setInterval(fetchNotifications, 30000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<template>
  <header class="border-b border-slate-200/80 bg-white/95 px-6 py-4 backdrop-blur dark:bg-slate-900/95 dark:border-slate-800">
    <div class="flex items-center justify-between gap-4">
      <div class="min-w-0 flex-1">
        <h1 class="truncate text-xl font-bold text-slate-900 dark:text-white lg:text-2xl">{{ title || 'Tableau de bord' }}</h1>
        <p v-if="subtitle" class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <button 
            :class="[
              'notification-bell relative rounded-xl p-3 transition-all duration-300 shadow-sm',
              unreadCount > 0
                ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 ring-2 ring-sky-300/30'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-sky-400',
            ]"
            aria-label="Notifications" 
            @click="showNotifications = !showNotifications"
          >
            <Bell :class="['h-6 w-6 transition-transform', unreadCount > 0 ? 'bell-shake' : '']" />
            <!-- Unread badge -->
            <span 
              v-if="unreadCount > 0" 
              class="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[11px] font-black text-white ring-2 ring-white dark:ring-slate-950 shadow-lg shadow-red-500/30"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
            <!-- Ping animation ring -->
            <span v-if="unreadCount > 0" class="absolute inset-0 rounded-xl animate-ping bg-sky-400/20 pointer-events-none" style="animation-duration: 2s;" />
          </button>

          <div v-if="showNotifications" class="fixed inset-0 z-40" @click="showNotifications = false" />

          <div v-if="showNotifications" class="absolute right-0 top-full z-50 mt-3 w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-200">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
              <div>
                <h3 class="font-bold text-slate-900 dark:text-white">Notifications</h3>
                <p v-if="unreadCount > 0" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ unreadCount }} non lue{{ unreadCount > 1 ? 's' : '' }}</p>
              </div>
              <button 
                v-if="unreadCount > 0" 
                @click="handleMarkAllAsRead" 
                class="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium transition-colors"
              >
                <CheckCheck class="h-3.5 w-3.5" />
                Tout lire
              </button>
            </div>
            
            <div class="max-h-[420px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              <div v-if="isLoading && notifications.length === 0" class="flex justify-center items-center py-10">
                <RefreshCw class="h-5 w-5 text-sky-500 animate-spin" />
              </div>
              <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
                <Bell class="h-10 w-10 mb-3 stroke-1 opacity-40" />
                <p class="text-sm font-medium">Aucune notification</p>
                <p class="text-xs mt-1">Vous serez notifié des mises à jour ici</p>
              </div>
              <div
                v-else
                v-for="notification in notifications"
                :key="`${notification.type}-${notification.id}`"
                @click="handleNotificationClick(notification)"
                :class="[
                  'flex items-start gap-3 px-5 py-4 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  notification.unread ? 'bg-sky-50/40 dark:bg-sky-950/15 border-l-3 border-l-sky-500' : '',
                ]"
              >
                <!-- Icon mapping -->
                <div v-if="notification.status === 'confirmee' || notification.status === 'approuver'" class="p-2 bg-green-50 text-green-600 rounded-lg dark:bg-green-900/30 dark:text-green-400">
                  <Check class="h-4 w-4" />
                </div>
                <div v-else-if="notification.status === 'refusee' || notification.status === 'refuser'" class="p-2 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/30 dark:text-red-400">
                  <XIcon class="h-4 w-4" />
                </div>
                <div v-else-if="notification.type === 'reservation' || notification.reservation_id" class="p-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                  <Calendar class="h-4 w-4" />
                </div>
                <div v-else-if="notification.type === 'reclamation' || notification.reclamation_id" class="p-2 bg-amber-50 text-amber-600 rounded-lg dark:bg-amber-900/30 dark:text-amber-400">
                  <AlertTriangle class="h-4 w-4" />
                </div>
                <div v-else class="p-2 bg-slate-50 text-slate-600 rounded-lg dark:bg-slate-900/30 dark:text-slate-400">
                  <Info class="h-4 w-4" />
                </div>

                <div class="flex-1 min-w-0">
                  <p :class="['text-sm text-slate-800 dark:text-slate-200 leading-snug', notification.unread ? 'font-semibold' : '']">
                    {{ notification.message }}
                  </p>
                  <div class="flex items-center gap-2 mt-1.5">
                    <p class="text-xs text-slate-400 dark:text-slate-500">{{ formatTime(notification.time) }}</p>
                    <span 
                      v-if="getStatusBadge(notification)" 
                      :class="['px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide', getStatusBadge(notification)!.class]"
                    >
                      {{ getStatusBadge(notification)!.text }}
                    </span>
                  </div>
                  <p v-if="getNotificationLink(notification)" class="text-[11px] text-sky-500 mt-1 font-medium">
                    Cliquez pour voir les détails →
                  </p>
                </div>
                
                <span v-if="notification.unread" class="h-2.5 w-2.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0 shadow-sm shadow-sky-500/30" />
              </div>
            </div>

            <div class="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 flex justify-between items-center">
              <button 
                class="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors" 
                @click="fetchNotifications"
                :disabled="isLoading"
              >
                <RefreshCw :class="['h-3 w-3', isLoading ? 'animate-spin' : '']" />
                Actualiser
              </button>
              <span class="text-[10px] text-slate-400 font-mono">ImmoGestion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
@keyframes bell-shake {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-12deg); }
  30% { transform: rotate(10deg); }
  40% { transform: rotate(-8deg); }
  50% { transform: rotate(5deg); }
  60% { transform: rotate(-3deg); }
  70% { transform: rotate(0deg); }
}

.bell-shake {
  animation: bell-shake 1.5s ease-in-out infinite;
  transform-origin: top center;
}

.notification-bell:hover .bell-shake {
  animation-duration: 0.6s;
}
</style>
