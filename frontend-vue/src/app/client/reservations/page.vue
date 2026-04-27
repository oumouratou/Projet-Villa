<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Calendar, Home, Search, Filter, Eye, Clock, CheckCircle, XCircle, Ban } from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { getList } from '@/lib/api'
import { getStoredUser } from '@/lib/session'

const statusFilter = ref<'all' | 'en_attente' | 'confirmee' | 'refusee' | 'annulee'>('all')
const searchQuery = ref('')
const reservations = ref<any[]>([])
const currentUser = computed(() => getStoredUser() as { email?: string } | null)

const clientReservations = computed(() =>
  reservations.value.filter(reservation => reservation.client?.email === currentUser.value?.email),
)

const filteredReservations = computed(() => clientReservations.value.filter((reservation) => {
  const matchesStatus = statusFilter.value === 'all' || reservation.status === statusFilter.value
  const matchesSearch = !searchQuery.value
    || reservation.property?.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    || reservation.property?.city?.toLowerCase().includes(searchQuery.value.toLowerCase())

  return matchesStatus && matchesSearch
}))

const statusColors = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  confirmee: 'bg-green-100 text-green-800',
  refusee: 'bg-red-100 text-red-800',
  annulee: 'bg-gray-100 text-gray-800',
}

const statusLabels = {
  en_attente: 'En attente',
  confirmee: 'Confirmee',
  refusee: 'Refusee',
  annulee: 'Annulee',
}

const statusIcons = {
  en_attente: Clock,
  confirmee: CheckCircle,
  refusee: XCircle,
  annulee: Ban,
}

const getReservationStatusClass = (status: string) => statusColors[status as keyof typeof statusColors] || statusColors.en_attente
const getReservationStatusIcon = (status: string) => statusIcons[status as keyof typeof statusIcons] || Clock
const getReservationStatusLabel = (status: string) => statusLabels[status as keyof typeof statusLabels] || status

onMounted(async () => {
  reservations.value = await getList('/reservations')
})
</script>

<template>
  <DashboardHeader title="Mes reservations" subtitle="Consultez et suivez vos demandes de reservation" />

  <main class="flex-1 overflow-auto p-6">
    <div class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <article class="rounded-xl border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Calendar class="h-5 w-5 text-primary" /></div>
          <div><p class="text-xl font-bold">{{ clientReservations.length }}</p><p class="text-xs text-muted-foreground">Total</p></div>
        </div>
      </article>
      <article class="rounded-xl border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100"><Clock class="h-5 w-5 text-yellow-600" /></div>
          <div><p class="text-xl font-bold">{{ clientReservations.filter(r => r.status === 'en_attente').length }}</p><p class="text-xs text-muted-foreground">En attente</p></div>
        </div>
      </article>
      <article class="rounded-xl border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100"><CheckCircle class="h-5 w-5 text-green-600" /></div>
          <div><p class="text-xl font-bold">{{ clientReservations.filter(r => r.status === 'confirmee').length }}</p><p class="text-xs text-muted-foreground">Confirmees</p></div>
        </div>
      </article>
      <article class="rounded-xl border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100"><XCircle class="h-5 w-5 text-red-600" /></div>
          <div><p class="text-xl font-bold">{{ clientReservations.filter(r => r.status === 'refusee').length }}</p><p class="text-xs text-muted-foreground">Refusees</p></div>
        </div>
      </article>
    </div>

    <div class="mb-6 rounded-xl border border-border bg-card p-4">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher par bien ou ville..." class="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4" />
        </div>
        <div class="flex items-center gap-2">
          <Filter class="h-5 w-5 text-muted-foreground" />
          <select v-model="statusFilter" class="rounded-lg border border-input bg-background px-4 py-2.5">
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmees</option>
            <option value="refusee">Refusees</option>
            <option value="annulee">Annulees</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="filteredReservations.length > 0" class="space-y-4">
      <div v-for="reservation in filteredReservations" :key="reservation.id" class="rounded-xl border border-border bg-card p-5">
        <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div class="flex items-start gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
              <Home class="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <h3 class="mb-1 font-semibold">{{ reservation.property?.title }}</h3>
              <p class="mb-2 text-sm text-muted-foreground">{{ reservation.property?.city }}</p>
              <div class="flex flex-wrap items-center gap-3 text-sm">
                <span class="flex items-center gap-1 text-muted-foreground">
                  <Calendar class="h-4 w-4" />{{ new Date(reservation.start_date || reservation.startDate).toLocaleDateString('fr-FR') }} - {{ new Date(reservation.end_date || reservation.endDate).toLocaleDateString('fr-FR') }}
                </span>
                <span class="font-medium">{{ Number(reservation.total_price || reservation.totalPrice || 0).toLocaleString() }} FCFA</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium" :class="getReservationStatusClass(reservation.status)">
              <component :is="getReservationStatusIcon(reservation.status)" class="h-4 w-4" />{{ getReservationStatusLabel(reservation.status) }}
            </span>
            <RouterLink :to="`/client/reservations/${reservation.id}`" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              <Eye class="h-4 w-4" />Details
            </RouterLink>
          </div>
        </div>
        <div v-if="reservation.agent_comment || reservation.agentComment" class="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
          <span class="font-medium text-foreground">Commentaire de l'agent :</span> {{ reservation.agent_comment || reservation.agentComment }}
        </div>
      </div>
    </div>

    <div v-else class="rounded-xl border border-border bg-card py-16 text-center">
      <Calendar class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h3 class="mb-2 text-lg font-semibold">Aucune reservation trouvee</h3>
      <p class="mb-4 text-muted-foreground">Vous n'avez pas encore de reservation</p>
      <RouterLink to="/client/recherche" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground">Rechercher un bien</RouterLink>
    </div>
  </main>
</template>