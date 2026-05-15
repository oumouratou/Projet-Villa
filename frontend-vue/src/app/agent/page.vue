<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Building2,
  Clock,
  MessageSquare,
  Users,
  Home,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-vue-next'
import { getDashboardStats, getList } from '@/lib/api'

const dashboardStats = ref({
  totalProperties: 0,
  totalReservations: 0,
  pendingReservations: 0,
  totalClients: 0,
  totalRevenue: 0,
  occupancyRate: 0,
})

const properties = ref<any[]>([])
const reservations = ref<any[]>([])
const complaints = ref<any[]>([])
const clients = ref<any[]>([])

const pendingReservations = computed(() =>
  reservations.value.filter((item) => item.status === 'en_attente'),
)

const pendingComplaints = computed(() =>
  complaints.value.filter((item) => (item.statut ?? item.status) === 'en_attente'),
)

const availableProperties = computed(() =>
  properties.value.filter((item) => item.status === 'disponible'),
)

const formatDate = (value: unknown) => {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value as string)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('fr-FR')
}

onMounted(async () => {
  dashboardStats.value = await getDashboardStats()
  properties.value = await getList('/properties')
  reservations.value = await getList('/reservations')
    complaints.value = await getList('/reclamations')
  clients.value = await getList('/clients')
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Tableau de bord Agent</h1>
      <p class="mt-1 text-muted-foreground">
        Bienvenue, gerez vos biens et reservations
      </p>
    </div>

    <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <article class="rounded-xl border border-border bg-card p-5">
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">Biens geres</p>
          <Building2 class="h-5 w-5 text-primary" />
        </div>
        <p class="mt-2 text-2xl font-bold">{{ dashboardStats.totalProperties }}</p>
        <p class="mt-1 text-xs text-muted-foreground">
          {{ availableProperties.length }} disponibles
        </p>
      </article>

      <article class="rounded-xl border border-border bg-card p-5">
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">Reservations en attente</p>
          <Clock class="h-5 w-5 text-orange-600" />
        </div>
        <p class="mt-2 text-2xl font-bold">{{ pendingReservations.length }}</p>
        <p class="mt-1 text-xs text-muted-foreground">A traiter</p>
      </article>

      <article class="rounded-xl border border-border bg-card p-5">
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">Reclamations ouvertes</p>
          <MessageSquare class="h-5 w-5 text-red-600" />
        </div>
        <p class="mt-2 text-2xl font-bold">{{ pendingComplaints.length }}</p>
        <p class="mt-1 text-xs text-muted-foreground">En cours de traitement</p>
      </article>

      <article class="rounded-xl border border-border bg-card p-5">
        <div class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">Clients actifs</p>
          <Users class="h-5 w-5 text-green-600" />
        </div>
        <p class="mt-2 text-2xl font-bold">{{ dashboardStats.totalClients || clients.length }}</p>
        <p class="mt-1 text-xs text-muted-foreground">Inscrits sur la plateforme</p>
      </article>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-border bg-card">
        <div class="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 class="font-semibold">Reservations en attente</h2>
            <p class="text-sm text-muted-foreground">Actions requises</p>
          </div>
          <RouterLink
            to="/agent/reservations"
            class="inline-flex items-center gap-1 text-sm text-primary"
          >
            Voir tout
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
        </div>

        <div class="space-y-3 p-5">
          <article
            v-for="reservation in pendingReservations.slice(0, 4)"
            :key="reservation.id"
            class="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Home class="h-5 w-5 text-primary" />
              </div>
              <div>
                <p class="text-sm font-medium">{{ reservation.property?.title }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ reservation.client?.firstName }} {{ reservation.client?.lastName }}
                  • {{ formatDate(reservation.startDate ?? reservation.start_date) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button class="rounded border border-green-600 p-1.5 text-green-600 hover:bg-green-50">
                <CheckCircle2 class="h-4 w-4" />
              </button>
              <button class="rounded border border-red-600 p-1.5 text-red-600 hover:bg-red-50">
                <XCircle class="h-4 w-4" />
              </button>
            </div>
          </article>

          <p
            v-if="pendingReservations.length === 0"
            class="text-sm text-muted-foreground"
          >
            Aucune reservation en attente.
          </p>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card">
        <div class="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 class="font-semibold">Reclamations ouvertes</h2>
            <p class="text-sm text-muted-foreground">A traiter en priorite</p>
          </div>
          <RouterLink
            to="/agent/reclamations"
            class="inline-flex items-center gap-1 text-sm text-primary"
          >
            Voir tout
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
        </div>

        <div class="space-y-3 p-5">
          <article
            v-for="complaint in pendingComplaints.slice(0, 4)"
            :key="complaint.id"
            class="rounded-lg border border-border p-3"
          >
            <p class="font-medium">{{ complaint.subject }}</p>
            <p class="text-xs text-muted-foreground">
              {{ formatDate(complaint.createdAt ?? complaint.created_at) }}
            </p>
          </article>

          <p
            v-if="pendingComplaints.length === 0"
            class="text-sm text-muted-foreground"
          >
            Aucune reclamation ouverte.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
