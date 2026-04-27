<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search, Eye, CalendarDays, Clock, CheckCircle2, XCircle } from 'lucide-vue-next'
import { getList } from '@/lib/api'

const reservations = ref<any[]>([])

const searchTerm = ref('')
const statusFilter = ref('all')

const filteredReservations = computed(() => {
  return reservations.value.filter((reservation) => {
    const property = reservation.property
    const client = reservation.client
    const matchesSearch =
      property?.title?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      `${client?.first_name ?? client?.firstName ?? ''} ${client?.last_name ?? client?.lastName ?? ''}`.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || reservation.status === statusFilter.value
    return !!matchesSearch && matchesStatus
  })
})

onMounted(async () => {
  reservations.value = await getList('/reservations')
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Gestion des reservations</h1>
      <p class="mt-1 text-muted-foreground">Gerez toutes les demandes de reservation</p>
    </div>

    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article class="rounded-xl border border-border bg-card p-5"><p class="text-sm text-muted-foreground">Total</p><p class="text-2xl font-bold">{{ reservations.length }}</p></article>
      <article class="rounded-xl border border-border bg-card p-5"><p class="text-sm text-muted-foreground">En attente</p><p class="text-2xl font-bold text-orange-600">{{ reservations.filter((r) => r.status === 'en_attente').length }}</p></article>
      <article class="rounded-xl border border-border bg-card p-5"><p class="text-sm text-muted-foreground">Confirmees</p><p class="text-2xl font-bold text-green-600">{{ reservations.filter((r) => r.status === 'confirmee').length }}</p></article>
      <article class="rounded-xl border border-border bg-card p-5"><p class="text-sm text-muted-foreground">Refusees</p><p class="text-2xl font-bold text-red-600">{{ reservations.filter((r) => r.status === 'refusee').length }}</p></article>
    </section>

    <div class="rounded-xl border border-border bg-card p-4">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input v-model="searchTerm" placeholder="Rechercher par bien ou client..." class="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3" />
        </div>
        <select v-model="statusFilter" class="rounded-lg border border-input bg-background px-3 py-2">
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmee</option>
          <option value="refusee">Refusee</option>
        </select>
      </div>
    </div>

    <div class="rounded-xl border border-border bg-card p-5">
      <h2 class="mb-4 flex items-center gap-2 font-semibold">
        <CalendarDays class="h-5 w-5" />
        Liste des reservations
      </h2>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-left text-muted-foreground">
              <th class="px-3 py-2">Bien</th>
              <th class="px-3 py-2">Client</th>
              <th class="px-3 py-2">Dates</th>
              <th class="px-3 py-2">Montant</th>
              <th class="px-3 py-2">Statut</th>
              <th class="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="reservation in filteredReservations"
              :key="reservation.id"
              class="border-b border-border/60 hover:bg-muted/40"
            >
              <td class="px-3 py-3">
                <div class="flex items-center gap-3">
                  <img :src="reservation.property?.images?.[0] || '/placeholder.svg'" :alt="reservation.property?.title" class="h-10 w-12 rounded object-cover" />
                  <div>
                    <p class="font-medium">{{ reservation.property?.title }}</p>
                    <p class="text-xs text-muted-foreground">{{ reservation.property?.city }}</p>
                  </div>
                </div>
              </td>
              <td class="px-3 py-3">
                <p class="font-medium">{{ reservation.client?.first_name ?? reservation.client?.firstName }} {{ reservation.client?.last_name ?? reservation.client?.lastName }}</p>
                <p class="text-xs text-muted-foreground">{{ reservation.client?.email }}</p>
              </td>
              <td class="px-3 py-3">
                {{ new Date(reservation.start_date || reservation.startDate).toLocaleDateString('fr-FR') }}
                <br />
                <span class="text-xs text-muted-foreground">au {{ new Date(reservation.end_date || reservation.endDate).toLocaleDateString('fr-FR') }}</span>
              </td>
              <td class="px-3 py-3 font-medium">{{ Number(reservation.total_price || reservation.totalPrice || 0).toLocaleString() }} FCFA</td>
              <td class="px-3 py-3">
                <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs">
                  <Clock v-if="reservation.status === 'en_attente'" class="h-3 w-3" />
                  <CheckCircle2 v-if="reservation.status === 'confirmee'" class="h-3 w-3" />
                  <XCircle v-if="reservation.status === 'refusee'" class="h-3 w-3" />
                  {{ reservation.status }}
                </span>
              </td>
              <td class="px-3 py-3 text-right">
                <RouterLink :to="`/agent/reservations/${reservation.id}`" class="inline-flex items-center gap-2 text-primary">
                  <Eye class="h-4 w-4" />
                  Voir
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
