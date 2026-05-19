<template>
  <div class="space-y-6 p-6">
    <!-- En-tête -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Historique des activités</h1>
        <p class="text-slate-500 mt-1">Journal complet des actions sur la plateforme</p>
      </div>
      <div class="flex gap-3">
        <select
          v-model="filterType"
          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les types</option>
          <option value="reservation">Réservations</option>
          <option value="reclamation">Réclamations</option>
          <option value="bien">Biens</option>
          <option value="utilisateur">Utilisateurs</option>
        </select>
        <button
          @click="refresh"
          class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
        >
          <RefreshCw class="h-4 w-4" />
          Actualiser
        </button>
      </div>
    </div>

    <!-- Cartes de statistiques rapides -->
    <div class="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <CalendarCheck class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ reservations.length }}</p>
            <p class="text-xs text-slate-500">Réservations</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <MessageSquare class="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ reclamations.length }}</p>
            <p class="text-xs text-slate-500">Réclamations</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Building2 class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ biens.length }}</p>
            <p class="text-xs text-slate-500">Biens enregistrés</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Users class="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ users.length }}</p>
            <p class="text-xs text-slate-500">Utilisateurs</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline d'activités -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-bold text-slate-900 flex items-center gap-2">
          <FileText class="h-5 w-5 text-blue-600" />
          Journal d'activités
        </h3>
        <span class="text-sm text-slate-500">{{ filteredActivities.length }} entrées</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>

      <!-- Vide -->
      <div v-else-if="filteredActivities.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
        <FileText class="h-12 w-12 mb-3 opacity-30" />
        <p class="font-medium">Aucune activité trouvée</p>
      </div>

      <!-- Liste -->
      <div v-else class="divide-y divide-slate-50">
        <div
          v-for="(item, idx) in filteredActivities"
          :key="idx"
          class="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
        >
          <!-- Icône colorée -->
          <div :class="['w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5', item.bgClass]">
            <component :is="item.icon" class="h-4 w-4 text-white" />
          </div>

          <!-- Contenu -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-900">{{ item.title }}</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ item.description }}</p>
          </div>

          <!-- Badge statut -->
          <span :class="['shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide', item.badgeClass]">
            {{ item.status }}
          </span>

          <!-- Date -->
          <span class="shrink-0 text-xs text-slate-400 whitespace-nowrap">
            {{ formatDate(item.date) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Section Réservations récentes -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <h3 class="font-bold text-slate-900 flex items-center gap-2">
          <CalendarCheck class="h-5 w-5 text-green-600" />
          Dernières réservations
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th class="px-6 py-3 text-left">ID</th>
              <th class="px-6 py-3 text-left">Client</th>
              <th class="px-6 py-3 text-left">Bien</th>
              <th class="px-6 py-3 text-left">Statut</th>
              <th class="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="r in reservations.slice(0, 8)" :key="r.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-3 font-mono text-slate-400">#{{ r.id }}</td>
              <td class="px-6 py-3 font-medium text-slate-900">
                {{ r.client?.user?.first_name || r.client?.user?.name || '—' }}
                {{ r.client?.user?.last_name || '' }}
              </td>
              <td class="px-6 py-3 text-slate-600">{{ r.bien?.titre || r.property?.title || '—' }}</td>
              <td class="px-6 py-3">
                <span :class="statusBadge(r.status)">{{ r.status }}</span>
              </td>
              <td class="px-6 py-3 text-slate-400">{{ formatDate(r.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section Réclamations récentes -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <h3 class="font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare class="h-5 w-5 text-orange-600" />
          Dernières réclamations
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th class="px-6 py-3 text-left">ID</th>
              <th class="px-6 py-3 text-left">Sujet</th>
              <th class="px-6 py-3 text-left">Client</th>
              <th class="px-6 py-3 text-left">Statut</th>
              <th class="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="rec in reclamations.slice(0, 8)" :key="rec.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-3 font-mono text-slate-400">#{{ rec.id }}</td>
              <td class="px-6 py-3 font-medium text-slate-900">{{ rec.sujet || rec.subject || '—' }}</td>
              <td class="px-6 py-3 text-slate-600">
                {{ rec.client?.user?.first_name || rec.client?.user?.name || '—' }}
              </td>
              <td class="px-6 py-3">
                <span :class="reclamationBadge(rec.status)">{{ rec.status }}</span>
              </td>
              <td class="px-6 py-3 text-slate-400">{{ formatDate(rec.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Building2, CalendarCheck, MessageSquare, Users, FileText,
  RefreshCw, UserPlus, Home, ClipboardList
} from 'lucide-vue-next'
import { getList } from '@/lib/api'

const loading = ref(true)
const filterType = ref('')
const reservations = ref<any[]>([])
const reclamations = ref<any[]>([])
const biens = ref<any[]>([])
const users = ref<any[]>([])

const loadData = async () => {
  loading.value = true
  try { reservations.value = await getList('/reservations') } catch { reservations.value = [] }
  try { reclamations.value = await getList('/reclamations') } catch { reclamations.value = [] }
  try { biens.value = await getList('/properties') } catch { biens.value = [] }
  try { users.value = await getList('/users') } catch { users.value = [] }
  loading.value = false
}

const refresh = () => loadData()
onMounted(loadData)

// Construire la timeline unifiée
const allActivities = computed(() => {
  const items: any[] = []

  reservations.value.forEach((r) => {
    items.push({
      type: 'reservation',
      title: `Réservation #${r.id}`,
      description: `Client: ${r.client?.user?.first_name || r.client?.user?.name || 'Inconnu'} — Bien: ${r.bien?.titre || r.property?.title || '—'}`,
      status: r.status,
      date: r.created_at,
      icon: CalendarCheck,
      bgClass: r.status === 'confirmee' ? 'bg-green-500' : r.status === 'refusee' ? 'bg-red-500' : 'bg-amber-500',
      badgeClass: statusBadge(r.status),
    })
  })

  reclamations.value.forEach((r) => {
    items.push({
      type: 'reclamation',
      title: `Réclamation: ${r.sujet || r.subject || `#${r.id}`}`,
      description: `Client: ${r.client?.user?.first_name || r.client?.user?.name || 'Inconnu'}`,
      status: r.status,
      date: r.created_at,
      icon: ClipboardList,
      bgClass: r.status === 'resolue' ? 'bg-green-500' : 'bg-orange-500',
      badgeClass: reclamationBadge(r.status),
    })
  })

  biens.value.forEach((b) => {
    items.push({
      type: 'bien',
      title: `Bien: ${b.titre || b.title || `#${b.id}`}`,
      description: `Type: ${b.type || '—'} — Ville: ${b.ville || b.city || '—'}`,
      status: b.statut || b.status || 'actif',
      date: b.created_at,
      icon: Home,
      bgClass: 'bg-blue-500',
      badgeClass: 'bg-blue-100 text-blue-700',
    })
  })

  users.value.forEach((u) => {
    items.push({
      type: 'utilisateur',
      title: `Utilisateur: ${u.first_name || u.name || u.email}`,
      description: `Email: ${u.email} — Rôle: ${u.role || '—'}`,
      status: u.status || 'actif',
      date: u.created_at,
      icon: UserPlus,
      bgClass: 'bg-purple-500',
      badgeClass: u.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600',
    })
  })

  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const filteredActivities = computed(() => {
  if (!filterType.value) return allActivities.value
  return allActivities.value.filter((a) => a.type === filterType.value)
})

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

const statusBadge = (status: string) => {
  if (status === 'confirmee') return 'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700'
  if (status === 'refusee') return 'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700'
  return 'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700'
}

const reclamationBadge = (status: string) => {
  if (status === 'resolue') return 'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700'
  if (status === 'rejetee') return 'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700'
  return 'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 text-orange-700'
}
</script>
