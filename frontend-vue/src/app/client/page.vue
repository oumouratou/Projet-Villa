<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar, MessageSquare, Home, Clock, CheckCircle2,
  ArrowRight, Bell, Search, Plus, MapPin
} from 'lucide-vue-next'
import { getList } from '@/lib/api'
import { getStoredUser } from '@/lib/session'

const router = useRouter()

const reservations = ref<any[]>([])
const complaints   = ref<any[]>([])
const loadingRes   = ref(true)
const loadingCom   = ref(true)

const currentUser = computed(() => getStoredUser() as { email?: string; role?: string; name?: string } | null)
const userName    = computed(() => currentUser.value?.name ?? 'Client')

const pending   = computed(() => reservations.value.filter(r => r.status === 'en_attente'))
const confirmed = computed(() => reservations.value.filter(r => r.status === 'confirmee'))
const refused   = computed(() => reservations.value.filter(r => r.status === 'refusee'))
const activeComplaints = computed(() =>
  complaints.value.filter(c => c.status === 'ouverte' || c.status === 'en_cours')
)

const notifications = computed(() => {
  const items: { id: string; type: string; text: string; date: string; color: string }[] = []

  reservations.value.slice(0, 5).forEach(r => {
    if (r.status === 'confirmee') {
      items.push({
        id: `res-${r.id}`, type: 'reservation',
        text: `Votre réservation "${r.property?.title ?? '#' + r.id}" a été confirmée ✅`,
        date: r.created_at ?? '', color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      })
    } else if (r.status === 'refusee') {
      items.push({
        id: `res-${r.id}`, type: 'reservation',
        text: `Votre réservation "${r.property?.title ?? '#' + r.id}" a été refusée`,
        date: r.created_at ?? '', color: 'bg-red-50 border-red-200 text-red-800',
      })
    }
  })

  complaints.value.slice(0, 5).forEach(c => {
    if ((c.agent_response || c.agentResponse) && c.status !== 'ouverte') {
      items.push({
        id: `com-${c.id}`, type: 'reclamation',
        text: `Un agent a répondu à votre réclamation "${c.subject ?? c.sujet}"`,
        date: c.created_at ?? '', color: 'bg-blue-50 border-blue-200 text-blue-800',
      })
    }
  })

  return items.slice(0, 5)
})

const statusBadge: Record<string, string> = {
  en_attente: 'bg-amber-100 text-amber-800',
  confirmee:  'bg-emerald-100 text-emerald-800',
  refusee:    'bg-red-100 text-red-800',
  annulee:    'bg-slate-100 text-slate-600',
}
const statusLabel: Record<string, string> = {
  en_attente: 'En attente',
  confirmee:  'Confirmée ✓',
  refusee:    'Refusée',
  annulee:    'Annulée',
}
const complaintBadge: Record<string, string> = {
  ouverte:  'bg-blue-100 text-blue-800',
  en_cours: 'bg-amber-100 text-amber-800',
  traitee:  'bg-emerald-100 text-emerald-800',
}
const complaintLabel: Record<string, string> = {
  ouverte:  'Ouverte',
  en_cours: 'En cours',
  traitee:  'Traitée ✓',
}

onMounted(async () => {
  try { reservations.value = await getList('/reservations') } catch { reservations.value = [] } finally { loadingRes.value = false }
  try { complaints.value   = await getList('/complaints')   } catch { complaints.value = [] }   finally { loadingCom.value = false }
})
</script>

<template>
  <main class="flex-1 overflow-auto bg-slate-50">
    <div class="p-6 space-y-6">

      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-slate-950">Bonjour, {{ userName }} 👋</h1>
          <p class="mt-1 text-slate-500">Voici un résumé de votre activité</p>
        </div>
        <RouterLink to="/biens"
          class="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-600 transition-colors shadow-sm shadow-sky-200">
          <Search class="h-4 w-4" />Rechercher un bien
        </RouterLink>
      </div>

      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50"><Calendar class="h-6 w-6 text-sky-600" /></div>
          <div><p class="text-2xl font-black text-slate-950">{{ reservations.length }}</p><p class="text-xs text-slate-500">Réservations</p></div>
        </div>
        <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50"><Clock class="h-6 w-6 text-amber-500" /></div>
          <div><p class="text-2xl font-black text-slate-950">{{ pending.length }}</p><p class="text-xs text-slate-500">En attente</p></div>
        </div>
        <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50"><CheckCircle2 class="h-6 w-6 text-emerald-600" /></div>
          <div><p class="text-2xl font-black text-slate-950">{{ confirmed.length }}</p><p class="text-xs text-slate-500">Confirmées</p></div>
        </div>
        <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50"><MessageSquare class="h-6 w-6 text-blue-600" /></div>
          <div><p class="text-2xl font-black text-slate-950">{{ activeComplaints.length }}</p><p class="text-xs text-slate-500">Réclamations</p></div>
        </div>
      </div>

      <div v-if="notifications.length > 0" class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-2 border-b border-slate-100 p-5 font-bold text-slate-950">
          <Bell class="h-5 w-5 text-sky-500" />
          Notifications récentes
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-black text-white">{{ notifications.length }}</span>
        </div>
        <div class="p-4 space-y-2">
          <div v-for="notif in notifications" :key="notif.id"
            class="rounded-xl border px-4 py-3 text-sm font-medium" :class="notif.color">
            {{ notif.text }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 p-5">
            <h2 class="font-bold text-slate-950">Mes réservations</h2>
            <RouterLink to="/client/reservations" class="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
              Voir tout <ArrowRight class="h-4 w-4" />
            </RouterLink>
          </div>

          <div v-if="loadingRes" class="p-6 space-y-3">
            <div v-for="i in 3" :key="i" class="h-16 animate-pulse rounded-xl bg-slate-100" />
          </div>

          <div v-else-if="reservations.length === 0" class="flex flex-col items-center py-12 text-center px-6">
            <Calendar class="mb-3 h-12 w-12 text-slate-300" />
            <p class="font-semibold text-slate-600">Aucune réservation</p>
            <RouterLink to="/biens" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-white hover:bg-sky-600 transition-colors">
              <Plus class="h-4 w-4" />Réserver un bien
            </RouterLink>
          </div>

          <div v-else class="divide-y divide-slate-100">
            <button v-for="r in reservations.slice(0, 4)" :key="r.id"
              @click="router.push(`/client/reservations/${r.id}`)"
              class="flex w-full items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors">
              <div class="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <img v-if="r.property?.images?.[0]" :src="r.property.images[0]" class="h-full w-full object-cover" :alt="r.property?.title" />
                <Home v-else class="m-auto mt-3.5 h-6 w-6 text-slate-400" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate font-semibold text-slate-950">{{ r.property?.title ?? 'Villa #' + r.id }}</p>
                <p class="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><MapPin class="h-3 w-3" />{{ r.property?.city }}</p>
                <p class="text-xs text-slate-400 mt-0.5">
                  {{ new Date(r.start_date ?? r.startDate).toLocaleDateString('fr-FR') }}
                  → {{ new Date(r.end_date ?? r.endDate).toLocaleDateString('fr-FR') }}
                </p>
              </div>
              <div class="flex flex-col items-end gap-1.5">
                <span class="rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap" :class="statusBadge[r.status] ?? 'bg-slate-100 text-slate-600'">
                  {{ statusLabel[r.status] ?? r.status }}
                </span>
                <span class="text-xs font-semibold text-slate-500">{{ Number(r.total_price ?? r.totalPrice ?? 0).toLocaleString() }} FCFA</span>
              </div>
            </button>
          </div>
        </div>

        <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 p-5">
            <h2 class="font-bold text-slate-950">Mes réclamations</h2>
            <RouterLink to="/client/reclamations" class="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
              Voir tout <ArrowRight class="h-4 w-4" />
            </RouterLink>
          </div>

          <div v-if="loadingCom" class="p-6 space-y-3">
            <div v-for="i in 3" :key="i" class="h-16 animate-pulse rounded-xl bg-slate-100" />
          </div>

          <div v-else-if="complaints.length === 0" class="flex flex-col items-center py-12 text-center px-6">
            <MessageSquare class="mb-3 h-12 w-12 text-slate-300" />
            <p class="font-semibold text-slate-600">Aucune réclamation</p>
            <p class="mt-1 text-sm text-slate-400">Déposez-en depuis une réservation confirmée</p>
          </div>

          <div v-else class="divide-y divide-slate-100">
            <button v-for="c in complaints.slice(0, 4)" :key="c.id"
              @click="router.push(`/client/reclamations/${c.id}`)"
              class="flex w-full items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors">
              <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                :class="c.status === 'traitee' ? 'bg-emerald-50' : c.status === 'en_cours' ? 'bg-amber-50' : 'bg-blue-50'">
                <CheckCircle2 v-if="c.status === 'traitee'" class="h-6 w-6 text-emerald-600" />
                <Clock v-else-if="c.status === 'en_cours'" class="h-6 w-6 text-amber-500" />
                <MessageSquare v-else class="h-6 w-6 text-blue-600" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate font-semibold text-slate-950">{{ c.subject ?? c.sujet }}</p>
                <p class="text-xs text-slate-400 mt-0.5">
                  Réservation #{{ c.reservation_id ?? c.reservationId }}
                  · {{ new Date(c.created_at ?? c.createdAt).toLocaleDateString('fr-FR') }}
                </p>
              </div>
              <span class="rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap" :class="complaintBadge[c.status] ?? 'bg-slate-100 text-slate-600'">
                {{ complaintLabel[c.status] ?? c.status }}
              </span>
            </button>
          </div>
        </div>

      </div>

      <div v-if="reservations.length === 0" class="rounded-2xl bg-slate-950 p-8 text-white text-center">
        <h3 class="text-2xl font-black mb-2">Trouvez votre prochaine villa</h3>
        <p class="text-slate-400 mb-5">Plus de 20 biens disponibles à Abidjan, Assinie, San-Pédro...</p>
        <RouterLink to="/biens" class="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-bold text-white hover:bg-sky-400 transition-colors">
          <Search class="h-5 w-5" />Voir les biens disponibles
        </RouterLink>
      </div>

    </div>
  </main>
</template>