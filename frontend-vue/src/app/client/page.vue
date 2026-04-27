<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, MessageSquare, Home, Clock, CheckCircle, ArrowRight } from 'lucide-vue-next'
import { getList } from '@/lib/api'
import { getStoredUser } from '@/lib/session'

const router = useRouter()

const reservations = ref<any[]>([])
const complaints = ref<any[]>([])
const currentUser = computed(() => getStoredUser() as { email?: string; role?: string; name?: string } | null)

const userEmail = computed(() => currentUser.value?.email ?? '')
const userName = computed(() => currentUser.value?.name ?? 'Client')

const clientReservations = computed(() =>
  reservations.value.filter((reservation) => reservation.client?.email === userEmail.value),
)

const clientComplaints = computed(() =>
  complaints.value.filter((complaint) => complaint.client?.email === userEmail.value),
)

const pendingReservations = computed(() => clientReservations.value.filter((item) => item.status === 'en_attente'))
const confirmedReservations = computed(() => clientReservations.value.filter((item) => item.status === 'confirmee'))
const activeComplaints = computed(() => clientComplaints.value.filter((item) => item.status !== 'traitee'))

const statusColors: Record<string, string> = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  confirmee: 'bg-green-100 text-green-800',
  refusee: 'bg-red-100 text-red-800',
  annulee: 'bg-gray-100 text-gray-800',
}

const statusLabels: Record<string, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  refusee: 'Refusée',
  annulee: 'Annulée',
}

const complaintStatusColors: Record<string, string> = {
  nouvelle: 'bg-blue-100 text-blue-800',
  en_cours: 'bg-yellow-100 text-yellow-800',
  traitee: 'bg-green-100 text-green-800',
}

const complaintStatusLabels: Record<string, string> = {
  nouvelle: 'Nouvelle',
  en_cours: 'En cours',
  traitee: 'Traitée',
}

onMounted(async () => {
  reservations.value = await getList('/reservations')
  complaints.value = await getList('/complaints')
})
</script>

<template>
  <main class="flex-1 overflow-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-black text-foreground">Bienvenue, {{ userName }}</h1>
      <p class="mt-1 text-muted-foreground">Vos réservations et réclamations sont synchronisées avec la base de données.</p>
    </div>

    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-[1.25rem] border border-border bg-card p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10"><Calendar class="h-6 w-6 text-primary" /></div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ clientReservations.length }}</p>
            <p class="text-sm text-muted-foreground">Réservations totales</p>
          </div>
        </div>
      </div>

      <div class="rounded-[1.25rem] border border-border bg-card p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100"><Clock class="h-6 w-6 text-yellow-600" /></div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ pendingReservations.length }}</p>
            <p class="text-sm text-muted-foreground">En attente</p>
          </div>
        </div>
      </div>

      <div class="rounded-[1.25rem] border border-border bg-card p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100"><CheckCircle class="h-6 w-6 text-green-600" /></div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ confirmedReservations.length }}</p>
            <p class="text-sm text-muted-foreground">Confirmées</p>
          </div>
        </div>
      </div>

      <div class="rounded-[1.25rem] border border-border bg-card p-5 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100"><MessageSquare class="h-6 w-6 text-blue-600" /></div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ activeComplaints.length }}</p>
            <p class="text-sm text-muted-foreground">Réclamations actives</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-[1.5rem] border border-border bg-card shadow-sm">
        <div class="flex items-center justify-between border-b border-border p-5">
          <h2 class="font-semibold text-foreground">Mes réservations récentes</h2>
          <button class="inline-flex items-center gap-1 text-sm text-primary" @click="router.push('/client/reservations')">
            Voir tout <ArrowRight class="h-4 w-4" />
          </button>
        </div>

        <div class="divide-y divide-border">
          <template v-if="clientReservations.length > 0">
            <button
              v-for="reservation in clientReservations.slice(0, 3)"
              :key="reservation.id"
              class="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/50"
              @click="router.push(`/client/reservations/${reservation.id}`)"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <Home class="h-6 w-6 text-muted-foreground" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium text-foreground">{{ reservation.property?.title }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ new Date(reservation.start_date).toLocaleDateString('fr-FR') }} - {{ new Date(reservation.end_date).toLocaleDateString('fr-FR') }}
                </p>
              </div>
              <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="statusColors[reservation.status]">
                {{ statusLabels[reservation.status] }}
              </span>
            </button>
          </template>

          <div v-else class="p-8 text-center">
            <Calendar class="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p class="text-muted-foreground">Aucune réservation</p>
          </div>
        </div>
      </div>

      <div class="rounded-[1.5rem] border border-border bg-card shadow-sm">
        <div class="flex items-center justify-between border-b border-border p-5">
          <h2 class="font-semibold text-foreground">Mes réclamations</h2>
          <button class="inline-flex items-center gap-1 text-sm text-primary" @click="router.push('/client/reclamations')">
            Voir tout <ArrowRight class="h-4 w-4" />
          </button>
        </div>

        <div class="divide-y divide-border">
          <template v-if="clientComplaints.length > 0">
            <button
              v-for="complaint in clientComplaints.slice(0, 3)"
              :key="complaint.id"
              class="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/50"
              @click="router.push(`/client/reclamations/${complaint.id}`)"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <MessageSquare class="h-6 w-6 text-muted-foreground" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium text-foreground">{{ complaint.subject }}</p>
                <p class="text-sm text-muted-foreground">{{ new Date(complaint.created_at || complaint.createdAt).toLocaleDateString('fr-FR') }}</p>
              </div>
              <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="complaintStatusColors[complaint.status]">
                {{ complaintStatusLabels[complaint.status] }}
              </span>
            </button>
          </template>

          <div v-else class="p-8 text-center">
            <MessageSquare class="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p class="text-muted-foreground">Aucune réclamation</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>