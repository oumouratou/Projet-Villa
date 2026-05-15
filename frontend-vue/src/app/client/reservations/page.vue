<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar, Home, Search, Filter, Eye, Clock,
  CheckCircle, XCircle, Ban, MapPin, Plus
} from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { getList } from '@/lib/api'
import { resolveImageSrc } from '@/lib/image'

const router = useRouter()
const reservations = ref<any[]>([])
const loading = ref(true)
const statusFilter = ref('all')
const searchQuery = ref('')

// --- SYNCHRONISATION AVEC LE BACKEND LARAVEL ---
// Le backend utilise 'statut' (fr) et 'bien' (fr)

const total = computed(() => reservations.value.length)
const pending = computed(() => reservations.value.filter(r => r.statut === 'en_attente').length)
const confirmed = computed(() => reservations.value.filter(r => r.statut === 'confirmee').length)
const refused = computed(() => reservations.value.filter(r => r.statut === 'refusee').length)

const imageSrc = (value?: string | null) => resolveImageSrc(value)

const filtered = computed(() =>
  reservations.value.filter(r => {
    // Filtre par statut
    const matchStatus = statusFilter.value === 'all' || r.statut === statusFilter.value
    
    // Recherche par titre de la villa ou ville (via la relation 'bien')
    const propertyTitle = r.bien?.titre || r.bien?.title || ''
    const propertyCity = r.bien?.ville || r.bien?.city || ''
    
    const matchSearch = !searchQuery.value
      || propertyTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
      || propertyCity.toLowerCase().includes(searchQuery.value.toLowerCase())
      
    return matchStatus && matchSearch
  })
)

const statusCls: Record<string, string> = {
  en_attente: 'bg-amber-100 text-amber-800 border border-amber-200',
  confirmee:  'bg-emerald-100 text-emerald-800 border border-emerald-200',
  refusee:    'bg-red-100 text-red-800 border border-red-200',
  annulee:    'bg-slate-100 text-slate-600 border border-slate-200',
}

const statusLbl: Record<string, string> = {
  en_attente: 'En attente',
  confirmee:  'Confirmée ✓',
  refusee:    'Refusée',
  annulee:    'Annulée',
}

const statusIcon: Record<string, any> = {
  en_attente: Clock,
  confirmee:  CheckCircle,
  refusee:    XCircle,
  annulee:    Ban,
}

const formatDate = (d: string) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const nights = (r: any) => {
  const s = new Date(r.date_debut)
  const e = new Date(r.date_fin)
  const diff = Math.floor((e.getTime() - s.getTime()) / 86400000)
  return Math.max(0, diff)
}

const loadReservations = async () => {
  loading.value = true
  try {
    const response = await getList('/reservations')
    reservations.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Erreur lors du chargement des réservations:', error)
    reservations.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReservations()
})
</script>

<template>
  <DashboardHeader
    title="Mes réservations"
    subtitle="Consultez et suivez toutes vos demandes de réservation"
  />

  <main class="flex-1 overflow-auto bg-slate-50 p-6">

    <!-- Compteurs -->
    <div class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50">
            <Calendar class="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <p class="text-2xl font-black text-slate-950">{{ total }}</p>
            <p class="text-xs text-slate-500">Total</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <Clock class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-2xl font-black text-amber-700">{{ pending }}</p>
            <p class="text-xs text-amber-600">En attente</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <CheckCircle class="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-black text-emerald-700">{{ confirmed }}</p>
            <p class="text-xs text-emerald-600">Confirmées</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-red-100 bg-red-50 p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
            <XCircle class="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p class="text-2xl font-black text-red-700">{{ refused }}</p>
            <p class="text-xs text-red-600">Refusées</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3 sm:flex-row">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input v-model="searchQuery" placeholder="Rechercher par villa ou ville..."
          class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20" />
      </div>
      <div class="flex items-center gap-2">
        <Filter class="h-4 w-4 text-slate-400" />
        <select v-model="statusFilter"
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none">
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmées</option>
          <option value="refusee">Refusées</option>
          <option value="annulee">Annulées</option>
        </select>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-28 animate-pulse rounded-2xl bg-slate-200" />
    </div>

    <!-- Liste -->
    <div v-else-if="filtered.length > 0" class="space-y-4">
      <div
        v-for="r in filtered"
        :key="r.id"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="h-1.5 w-full"
          :class="{
            'bg-amber-400':  r.statut === 'en_attente',
            'bg-emerald-500': r.statut === 'confirmee',
            'bg-red-500':    r.statut === 'refusee',
            'bg-slate-300':  r.statut === 'annulee',
          }" />

        <div class="p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center">

            <!-- Image + info bien -->
            <div class="flex items-start gap-4 flex-1 min-w-0">
              <div class="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <img
                  :src="imageSrc(r.bien?.images?.[0])"
                  class="h-full w-full object-cover"
                  :alt="r.bien?.titre || 'Bien'"
                />
                <Home v-if="!r.bien?.images?.[0]" class="m-auto mt-4 h-8 w-8 text-slate-400" />
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-slate-950 truncate">
                  {{ r.bien?.titre || 'Villa #' + r.id }}
                </h3>
                <p class="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin class="h-3 w-3" />{{ r.bien?.ville || 'Lieu non défini' }}
                </p>
                <p class="mt-1 text-sm text-slate-600">
                  📅 {{ formatDate(r.date_debut) }}
                  → {{ formatDate(r.date_fin) }}
                  <span class="ml-2 text-slate-400">({{ nights(r) }} nuit(s))</span>
                </p>
                <p class="mt-0.5 text-sm font-semibold text-sky-600">
                  {{ Number(r.total_price || 0).toLocaleString('fr-FR') }} FCFA
                </p>
              </div>
            </div>

            <!-- Statut + actions -->
            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                :class="statusCls[r.statut] || 'bg-slate-100 text-slate-600'">
                <component :is="statusIcon[r.statut] || Clock" class="h-3.5 w-3.5" />
                {{ statusLbl[r.statut] || r.statut }}
              </span>

              <button
                @click="router.push(`/client/reservations/${r.id}`)"
                class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Eye class="h-3.5 w-3.5" />Voir
              </button>
            </div>
          </div>

          <!-- Note de l'agent -->
          <div v-if="r.commentaire_agent"
            class="mt-4 border-t border-slate-100 pt-3 flex items-start gap-2">
            <span class="text-xs font-bold text-slate-500">Note de l'agent :</span>
            <span class="text-xs text-slate-600">{{ r.commentaire_agent }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Vide -->
    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
      <Calendar class="mx-auto mb-4 h-14 w-14 text-slate-300" />
      <h3 class="mb-1 text-lg font-bold text-slate-700">Aucune réservation</h3>
      <p class="mb-5 text-sm text-slate-400">Vous n'avez pas encore effectué de réservation</p>
      <RouterLink to="/client/recherche"
        class="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-600 transition-colors">
        <Plus class="h-4 w-4" />Réserver un bien
      </RouterLink>
    </div>

  </main>
</template>