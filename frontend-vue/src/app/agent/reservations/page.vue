<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search, Eye, CalendarDays, Clock, CheckCircle2, XCircle, RefreshCw, Filter } from 'lucide-vue-next'
import { getList, updateReservation } from '@/lib/api'
import { resolveImageSrc } from '@/lib/image'

const reservations  = ref<any[]>([])
const loading       = ref(true)
const searchTerm    = ref('')
const statusFilter  = ref('all')
const savingId      = ref<string | null>(null)
const feedback      = ref<{ id: string; msg: string; type: 'ok' | 'err' } | null>(null)

const reservationStatus = (r: any) => r.statut ?? r.status ?? 'en_attente'
const reservationProperty = (r: any) => r.property ?? r.bien ?? null
const reservationsList = computed(() => (Array.isArray(reservations.value) ? reservations.value : []))
const imageSrc = (value?: string | null) => resolveImageSrc(value)

const clientDisplayName = (client: any) => {
  const fullName = `${client?.first_name ?? ''} ${client?.last_name ?? ''}`.trim()
  return client?.name ?? (fullName || client?.email || '—')
}

const filtered = computed(() =>
  reservationsList.value.filter(r => {
    const property = reservationProperty(r)
    const propertyTitle = property?.title ?? property?.titre ?? ''
    const matchSearch =
      propertyTitle.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      clientDisplayName(r.client).toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchStatus = statusFilter.value === 'all' || reservationStatus(r) === statusFilter.value
    return matchSearch && matchStatus
  })
)

const total     = computed(() => reservationsList.value.length)
const pending   = computed(() => reservationsList.value.filter(r => reservationStatus(r) === 'en_attente').length)
const confirmed = computed(() => reservationsList.value.filter(r => reservationStatus(r) === 'confirmee').length)
const refused   = computed(() => reservationsList.value.filter(r => reservationStatus(r) === 'refusee').length)

const statusCls: Record<string, string> = {
  en_attente: 'bg-amber-100 text-amber-800 border border-amber-200',
  confirmee:  'bg-emerald-100 text-emerald-800 border border-emerald-200',
  refusee:    'bg-red-100 text-red-800 border border-red-200',
  annulee:    'bg-slate-100 text-slate-600 border border-slate-200',
}
const statusLbl: Record<string, string> = {
  en_attente: 'En attente',
  confirmee:  'Confirmée',
  refusee:    'Refusée',
  annulee:    'Annulée',
}

const clientName = (r: any) => {
  return clientDisplayName(r.client)
}

const setStatus = async (r: any, status: 'confirmee' | 'refusee') => {
  savingId.value = String(r.id)
  feedback.value = null
  try {
    const updated = await updateReservation({ id: String(r.id), status })
    const idx = reservations.value.findIndex(x => x.id === r.id)
    if (idx !== -1) reservations.value[idx] = { ...reservations.value[idx], ...updated, status: updated.status ?? status }
    feedback.value = {
      id: String(r.id),
      msg: status === 'confirmee' ? '✅ Réservation confirmée' : '❌ Réservation refusée',
      type: 'ok',
    }
    setTimeout(() => { feedback.value = null }, 3000)
  } catch (err) {
    feedback.value = { id: String(r.id), msg: err instanceof Error ? err.message : 'Erreur', type: 'err' }
  } finally {
    savingId.value = null
  }
}

onMounted(async () => {
  try {
    const response = await getList('/reservations')
    reservations.value = Array.isArray(response) ? response : ((response as any)?.data ?? [])
  } catch {
    reservations.value = []
  }
  finally { loading.value = false }
})
</script>

<template>
  <div class="space-y-6 p-6 lg:p-8 max-w-7xl mx-auto bg-slate-50 min-h-full">

    <div>
      <h1 class="text-3xl font-black text-slate-950 tracking-tight">Gestion des réservations</h1>
      <p class="mt-1 text-slate-500">Acceptez ou refusez les demandes de vos clients</p>
    </div>

    <div class="grid grid-cols-2 gap-5 lg:grid-cols-4">
      <div class="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600"><CalendarDays class="h-7 w-7" /></div>
        <div><p class="text-3xl font-black text-slate-900">{{ total }}</p><p class="text-sm font-semibold text-slate-500">Total</p></div>
      </div>
      <div class="rounded-[1.5rem] border border-amber-100 bg-amber-50/50 p-5 shadow-sm flex items-center gap-4">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600"><Clock class="h-7 w-7" /></div>
        <div><p class="text-3xl font-black text-amber-700">{{ pending }}</p><p class="text-sm font-semibold text-amber-600">En attente</p></div>
      </div>
      <div class="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm flex items-center gap-4">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600"><CheckCircle2 class="h-7 w-7" /></div>
        <div><p class="text-3xl font-black text-emerald-700">{{ confirmed }}</p><p class="text-sm font-semibold text-emerald-600">Confirmées</p></div>
      </div>
      <div class="rounded-[1.5rem] border border-red-100 bg-red-50/50 p-5 shadow-sm flex items-center gap-4">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600"><XCircle class="h-7 w-7" /></div>
        <div><p class="text-3xl font-black text-red-700">{{ refused }}</p><p class="text-sm font-semibold text-red-600">Refusées</p></div>
      </div>
    </div>

    <div class="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm flex flex-col gap-3 sm:flex-row">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input v-model="searchTerm" placeholder="Rechercher par bien ou client..."
          class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all" />
      </div>
      <div class="flex items-center gap-2">
        <Filter class="h-4 w-4 text-slate-400" />
        <select v-model="statusFilter" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20">
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmée</option>
          <option value="refusee">Refusée</option>
        </select>
      </div>
    </div>

    <div class="rounded-[1.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div class="border-b border-slate-100 p-5 bg-slate-50/50">
        <h2 class="flex items-center gap-2 font-bold text-slate-950">
          <CalendarDays class="h-5 w-5 text-sky-600" />{{ filtered?.length ?? 0 }} réservation(s)
        </h2>
      </div>

      <div v-if="loading" class="p-6 space-y-3">
        <div v-for="i in 4" :key="i" class="h-20 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div v-else-if="(filtered?.length ?? 0) === 0" class="p-16 text-center">
        <CalendarDays class="mx-auto mb-3 h-14 w-14 text-slate-200" />
        <p class="font-bold text-slate-700">Aucune réservation trouvée</p>
        <p class="text-sm text-slate-500 mt-1">Essayez d'ajuster vos filtres</p>
      </div>

      <div v-else class="divide-y divide-slate-100">
        <div v-for="r in filtered" :key="r.id" class="p-5 hover:bg-slate-50/50 transition-colors">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center">

            <div class="flex items-center gap-4 flex-1 min-w-0">
              <img
                :src="imageSrc(reservationProperty(r)?.images?.[0])"
                class="h-16 w-24 rounded-xl object-cover flex-shrink-0 shadow-sm" :alt="reservationProperty(r)?.title || reservationProperty(r)?.titre || 'Bien'" />
              <div class="min-w-0">
                <p class="font-bold text-slate-900 truncate">{{ reservationProperty(r)?.title ?? reservationProperty(r)?.titre ?? 'Bien #' + r.id }}</p>
                <p class="text-xs font-medium text-slate-500 mt-0.5">{{ reservationProperty(r)?.city ?? reservationProperty(r)?.ville ?? '—' }}</p>
              </div>
            </div>

            <div class="lg:w-40">
              <p class="text-sm font-bold text-slate-900">{{ clientName(r) }}</p>
              <p class="text-xs font-medium text-slate-500 truncate">{{ r.client?.email }}</p>
            </div>

            <div class="text-sm lg:w-36">
              <p class="font-bold text-slate-900">{{ new Date(r.date_debut ?? r.start_date ?? r.startDate).toLocaleDateString('fr-FR') }}</p>
              <p class="text-xs font-medium text-slate-500">au {{ new Date(r.date_fin ?? r.end_date ?? r.endDate).toLocaleDateString('fr-FR') }}</p>
            </div>

            <div class="text-sm font-black text-sky-600 lg:w-28">
              {{ Number(r.total_price ?? r.totalPrice ?? 0).toLocaleString() }} FCFA
            </div>

            <div class="flex flex-wrap items-center gap-2 lg:w-56 justify-end">

              <div v-if="feedback?.id === String(r.id)"
                class="w-full rounded-xl px-3 py-2 text-xs font-bold"
                :class="feedback.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'">
                {{ feedback.msg }}
              </div>

              <span class="rounded-full px-3 py-1.5 text-xs font-black" :class="statusCls[reservationStatus(r)] ?? 'bg-slate-100 text-slate-600'">
                {{ statusLbl[reservationStatus(r)] ?? reservationStatus(r) }}
              </span>

              <template v-if="reservationStatus(r) === 'en_attente'">
                <button @click="setStatus(r, 'confirmee')" :disabled="savingId === String(r.id)"
                  class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-sm">
                  <RefreshCw v-if="savingId === String(r.id)" class="h-3 w-3 animate-spin" />
                  <CheckCircle2 v-else class="h-3.5 w-3.5" />
                  Accepter
                </button>
                <button @click="setStatus(r, 'refusee')" :disabled="savingId === String(r.id)"
                  class="inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-50 transition-all shadow-sm">
                  <XCircle class="h-3.5 w-3.5" />Refuser
                </button>
              </template>

              <RouterLink :to="`/agent/reservations/${r.id}`"
                class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <Eye class="h-3.5 w-3.5" />Détail
              </RouterLink>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>