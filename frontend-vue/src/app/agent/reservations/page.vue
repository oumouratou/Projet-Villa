<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search, Eye, CalendarDays, Clock, CheckCircle2, XCircle, RefreshCw, Filter } from 'lucide-vue-next'
import { getList, updateReservation } from '@/lib/api'

const reservations  = ref<any[]>([])
const loading       = ref(true)
const searchTerm    = ref('')
const statusFilter  = ref('all')
const savingId      = ref<string | null>(null)
const feedback      = ref<{ id: string; msg: string; type: 'ok' | 'err' } | null>(null)

const filtered = computed(() =>
  reservations.value.filter(r => {
    const matchSearch =
      r.property?.title?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (r.client?.name ?? `${r.client?.first_name ?? ''} ${r.client?.last_name ?? ''}`).toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchStatus = statusFilter.value === 'all' || r.status === statusFilter.value
    return matchSearch && matchStatus
  })
)

const total     = computed(() => reservations.value.length)
const pending   = computed(() => reservations.value.filter(r => r.status === 'en_attente').length)
const confirmed = computed(() => reservations.value.filter(r => r.status === 'confirmee').length)
const refused   = computed(() => reservations.value.filter(r => r.status === 'refusee').length)

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

const clientName = (r: any) =>
  r.client?.name ?? `${r.client?.first_name ?? ''} ${r.client?.last_name ?? ''}`.trim() || r.client?.email || '—'

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
  try { reservations.value = await getList('/reservations') } catch { reservations.value = [] }
  finally { loading.value = false }
})
</script>

<template>
  <div class="space-y-6 p-6">

    <div>
      <h1 class="text-3xl font-black text-foreground">Gestion des réservations</h1>
      <p class="mt-1 text-muted-foreground">Acceptez ou refusez les demandes de vos clients</p>
    </div>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <CalendarDays class="h-8 w-8 text-sky-500 flex-shrink-0" />
        <div><p class="text-2xl font-black">{{ total }}</p><p class="text-xs text-muted-foreground">Total</p></div>
      </div>
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <Clock class="h-8 w-8 text-amber-500 flex-shrink-0" />
        <div><p class="text-2xl font-black text-amber-600">{{ pending }}</p><p class="text-xs text-muted-foreground">En attente</p></div>
      </div>
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <CheckCircle2 class="h-8 w-8 text-emerald-500 flex-shrink-0" />
        <div><p class="text-2xl font-black text-emerald-600">{{ confirmed }}</p><p class="text-xs text-muted-foreground">Confirmées</p></div>
      </div>
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <XCircle class="h-8 w-8 text-red-500 flex-shrink-0" />
        <div><p class="text-2xl font-black text-red-600">{{ refused }}</p><p class="text-xs text-muted-foreground">Refusées</p></div>
      </div>
    </div>

    <div class="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 sm:flex-row">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input v-model="searchTerm" placeholder="Rechercher par bien ou client..."
          class="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>
      <div class="flex items-center gap-2">
        <Filter class="h-4 w-4 text-muted-foreground" />
        <select v-model="statusFilter" class="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmée</option>
          <option value="refusee">Refusée</option>
        </select>
      </div>
    </div>

    <div class="rounded-xl border border-border bg-card overflow-hidden">
      <div class="border-b border-border p-5">
        <h2 class="flex items-center gap-2 font-semibold">
          <CalendarDays class="h-5 w-5 text-primary" />{{ filtered.length }} réservation(s)
        </h2>
      </div>

      <div v-if="loading" class="p-6 space-y-3">
        <div v-for="i in 4" :key="i" class="h-20 animate-pulse rounded-xl bg-muted" />
      </div>

      <div v-else-if="filtered.length === 0" class="p-12 text-center">
        <CalendarDays class="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
        <p class="text-muted-foreground">Aucune réservation trouvée</p>
      </div>

      <div v-else class="divide-y divide-border">
        <div v-for="r in filtered" :key="r.id" class="p-4 hover:bg-muted/30 transition-colors">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center">

            <div class="flex items-center gap-3 flex-1 min-w-0">
              <img
                :src="r.property?.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=100&h=80&fit=crop'"
                class="h-14 w-20 rounded-lg object-cover flex-shrink-0" :alt="r.property?.title" />
              <div class="min-w-0">
                <p class="font-semibold text-foreground truncate">{{ r.property?.title ?? 'Bien #' + r.id }}</p>
                <p class="text-xs text-muted-foreground">{{ r.property?.city }}</p>
              </div>
            </div>

            <div class="lg:w-40">
              <p class="text-sm font-medium text-foreground">{{ clientName(r) }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ r.client?.email }}</p>
            </div>

            <div class="text-sm lg:w-36">
              <p class="font-medium">{{ new Date(r.start_date ?? r.startDate).toLocaleDateString('fr-FR') }}</p>
              <p class="text-xs text-muted-foreground">au {{ new Date(r.end_date ?? r.endDate).toLocaleDateString('fr-FR') }}</p>
            </div>

            <div class="text-sm font-semibold lg:w-28">
              {{ Number(r.total_price ?? r.totalPrice ?? 0).toLocaleString() }} FCFA
            </div>

            <div class="flex flex-wrap items-center gap-2 lg:w-52 justify-end">

              <div v-if="feedback?.id === String(r.id)"
                class="w-full rounded-lg px-3 py-1.5 text-xs font-semibold"
                :class="feedback.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'">
                {{ feedback.msg }}
              </div>

              <span class="rounded-full px-3 py-1 text-xs font-bold" :class="statusCls[r.status] ?? 'bg-slate-100 text-slate-600'">
                {{ statusLbl[r.status] ?? r.status }}
              </span>

              <template v-if="r.status === 'en_attente'">
                <button @click="setStatus(r, 'confirmee')" :disabled="savingId === String(r.id)"
                  class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                  <RefreshCw v-if="savingId === String(r.id)" class="h-3 w-3 animate-spin" />
                  <CheckCircle2 v-else class="h-3 w-3" />
                  Accepter
                </button>
                <button @click="setStatus(r, 'refusee')" :disabled="savingId === String(r.id)"
                  class="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                  <XCircle class="h-3 w-3" />Refuser
                </button>
              </template>

              <RouterLink :to="`/agent/reservations/${r.id}`"
                class="inline-flex items-center gap-1 rounded-lg border border-input px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                <Eye class="h-3.5 w-3.5" />Détail
              </RouterLink>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>