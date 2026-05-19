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
  <div class="space-y-6 p-6 lg:p-8 max-w-7xl mx-auto bg-slate-50 min-h-full">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-950 tracking-tight">Tableau de bord Agent</h1>
        <p class="mt-1 text-slate-500">
          Bienvenue sur votre espace de gestion des biens et réservations.
        </p>
      </div>
    </div>

    <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Building2 class="h-7 w-7" />
          </div>
          <div>
            <p class="text-3xl font-black text-slate-900">{{ dashboardStats.totalProperties }}</p>
            <p class="text-sm font-semibold text-slate-500">Biens gérés</p>
          </div>
        </div>
        <div class="mt-4 border-t border-slate-100 pt-3">
          <p class="text-xs font-medium text-slate-500">
            <span class="text-blue-600 font-bold">{{ availableProperties.length }}</span> disponibles
          </p>
        </div>
      </article>

      <article class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <Clock class="h-7 w-7" />
          </div>
          <div>
            <p class="text-3xl font-black text-slate-900">{{ pendingReservations.length }}</p>
            <p class="text-sm font-semibold text-slate-500">Réservations</p>
          </div>
        </div>
        <div class="mt-4 border-t border-slate-100 pt-3">
          <p class="text-xs font-medium text-slate-500">En attente de traitement</p>
        </div>
      </article>

      <article class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <MessageSquare class="h-7 w-7" />
          </div>
          <div>
            <p class="text-3xl font-black text-slate-900">{{ pendingComplaints.length }}</p>
            <p class="text-sm font-semibold text-slate-500">Réclamations</p>
          </div>
        </div>
        <div class="mt-4 border-t border-slate-100 pt-3">
          <p class="text-xs font-medium text-slate-500">Ouvertes en ce moment</p>
        </div>
      </article>

      <article class="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Users class="h-7 w-7" />
          </div>
          <div>
            <p class="text-3xl font-black text-slate-900">{{ dashboardStats.totalClients || clients.length }}</p>
            <p class="text-sm font-semibold text-slate-500">Clients actifs</p>
          </div>
        </div>
        <div class="mt-4 border-t border-slate-100 pt-3">
          <p class="text-xs font-medium text-slate-500">Inscrits sur la plateforme</p>
        </div>
      </article>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-[1.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 p-6 bg-slate-50/50">
          <div>
            <h2 class="font-bold text-slate-950 flex items-center gap-2">
              <Clock class="h-5 w-5 text-amber-500" />
              Réservations en attente
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">Actions requises de votre part</p>
          </div>
          <RouterLink
            to="/agent/reservations"
            class="inline-flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            Voir tout
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
        </div>

        <div class="flex-1 p-6">
          <div class="space-y-4">
            <article
              v-for="reservation in pendingReservations.slice(0, 4)"
              :key="reservation.id"
              class="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50 hover:shadow-sm transition-all"
            >
              <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Home class="h-6 w-6" />
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900">{{ reservation.property?.title || 'Bien #' + reservation.id }}</p>
                  <p class="text-xs font-medium text-slate-500 mt-0.5">
                    {{ reservation.client?.firstName }} {{ reservation.client?.lastName }}
                  </p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    Début : <span class="font-semibold text-slate-500">{{ formatDate(reservation.startDate ?? reservation.start_date) }}</span>
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <RouterLink :to="`/agent/reservations/${reservation.id}`" class="rounded-lg bg-sky-50 p-2 text-sky-600 hover:bg-sky-100 transition-colors" title="Voir les détails">
                  <ArrowRight class="h-4 w-4" />
                </RouterLink>
              </div>
            </article>

            <div v-if="pendingReservations.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 class="h-12 w-12 text-emerald-100 mb-3" />
              <p class="font-bold text-slate-700">Aucune réservation en attente</p>
              <p class="text-sm text-slate-500 mt-1">Vous êtes à jour dans vos traitements.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[1.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 p-6 bg-slate-50/50">
          <div>
            <h2 class="font-bold text-slate-950 flex items-center gap-2">
              <MessageSquare class="h-5 w-5 text-red-500" />
              Réclamations ouvertes
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">À traiter en priorité</p>
          </div>
          <RouterLink
            to="/agent/reclamations"
            class="inline-flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            Voir tout
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
        </div>

        <div class="flex-1 p-6">
          <div class="space-y-4">
            <article
              v-for="complaint in pendingComplaints.slice(0, 4)"
              :key="complaint.id"
              class="flex items-center gap-4 rounded-xl border border-slate-100 p-4 hover:bg-slate-50 hover:shadow-sm transition-all cursor-pointer"
              @click="$router.push(`/agent/reclamations/${complaint.id}`)"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <MessageSquare class="h-6 w-6" />
              </div>
              <div>
                <p class="font-bold text-slate-900">{{ complaint.subject || complaint.sujet }}</p>
                <p class="text-xs font-medium text-slate-500 mt-1">
                  Reçue le <span class="font-semibold">{{ formatDate(complaint.createdAt ?? complaint.created_at) }}</span>
                </p>
              </div>
            </article>

            <div v-if="pendingComplaints.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 class="h-12 w-12 text-emerald-100 mb-3" />
              <p class="font-bold text-slate-700">Aucune réclamation ouverte</p>
              <p class="text-sm text-slate-500 mt-1">Tous les clients sont satisfaits.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
