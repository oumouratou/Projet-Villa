<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Calendar, MapPin, Clock, CheckCircle, XCircle, Ban, MessageSquare, Bed, Bath, Maximize } from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { getDetail } from '@/lib/api'

type ReservationStatus = 'en_attente' | 'confirmee' | 'refusee' | 'annulee'

const route = useRoute()
const reservation = ref<any | null>(null)

const statusColors: Record<ReservationStatus, string> = {
  en_attente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmee: 'bg-green-100 text-green-800 border-green-200',
  refusee: 'bg-red-100 text-red-800 border-red-200',
  annulee: 'bg-gray-100 text-gray-800 border-gray-200',
}
const statusLabels: Record<ReservationStatus, string> = {
  en_attente: 'Reservation en attente de confirmation',
  confirmee: 'Reservation confirmee',
  refusee: 'Reservation refusee',
  annulee: 'Reservation annulee',
}
const statusIcons: Record<ReservationStatus, any> = { en_attente: Clock, confirmee: CheckCircle, refusee: XCircle, annulee: Ban }

const getStatusClass = (status: string) => statusColors[status as ReservationStatus] || statusColors.en_attente
const getStatusIcon = (status: string) => statusIcons[status as ReservationStatus] || Clock
const getStatusLabel = (status: string) => statusLabels[status as ReservationStatus] || status

onMounted(async () => {
  try {
    reservation.value = await getDetail('/reservations', String(route.params.id))
  } catch {
    reservation.value = null
  }
})
</script>

<template>
  <DashboardHeader title="Detail de la reservation" />
  <main class="flex-1 overflow-auto p-6">
    <RouterLink to="/client/reservations" class="mb-6 inline-flex items-center gap-2 text-muted-foreground"><ArrowLeft class="h-4 w-4" />Retour aux reservations</RouterLink>
    <div v-if="!reservation" class="rounded-xl border border-border bg-card p-6">Reservation introuvable.</div>
    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <div class="flex items-center gap-3 rounded-xl border p-4" :class="getStatusClass(reservation.status)"><component :is="getStatusIcon(reservation.status)" class="h-6 w-6" /><div><p class="font-semibold">{{ getStatusLabel(reservation.status) }}</p><p v-if="reservation.status === 'en_attente'" class="text-sm opacity-80">Votre demande est en cours de traitement</p></div></div>
        <div class="overflow-hidden rounded-xl border border-border bg-card"><div class="h-48"><img :src="reservation.property?.images?.[0] || '/placeholder.svg'" :alt="reservation.property?.title || ''" class="h-full w-full object-cover" /></div><div class="p-5"><h2 class="mb-2 text-xl font-semibold">{{ reservation.property?.title }}</h2><div class="mb-4 flex items-center gap-2 text-muted-foreground"><MapPin class="h-4 w-4" /><span>{{ reservation.property?.address }}, {{ reservation.property?.city }}</span></div><div class="flex items-center gap-6 text-sm text-muted-foreground"><div class="flex items-center gap-1"><Maximize class="h-4 w-4" />{{ reservation.property?.surface }} m2</div><div class="flex items-center gap-1"><Bed class="h-4 w-4" />{{ reservation.property?.bedrooms }} ch.</div><div class="flex items-center gap-1"><Bath class="h-4 w-4" />{{ reservation.property?.bathrooms }} sdb</div></div></div></div>
        <div class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 font-semibold">Details de la reservation</h3><div class="grid grid-cols-2 gap-4"><div><p class="mb-1 text-sm text-muted-foreground">Date de debut</p><p class="font-medium flex items-center gap-2"><Calendar class="h-4 w-4 text-primary" />{{ new Date(reservation.startDate || reservation.start_date).toLocaleDateString('fr-FR') }}</p></div><div><p class="mb-1 text-sm text-muted-foreground">Date de fin</p><p class="font-medium flex items-center gap-2"><Calendar class="h-4 w-4 text-primary" />{{ new Date(reservation.endDate || reservation.end_date).toLocaleDateString('fr-FR') }}</p></div><div><p class="mb-1 text-sm text-muted-foreground">Duree</p><p class="font-medium">{{ Math.ceil((new Date(reservation.endDate || reservation.end_date).getTime() - new Date(reservation.startDate || reservation.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)) }} mois</p></div><div><p class="mb-1 text-sm text-muted-foreground">Date de demande</p><p class="font-medium">{{ new Date(reservation.createdAt || reservation.created_at).toLocaleDateString('fr-FR') }}</p></div></div></div>
        <div v-if="reservation.agentComment || reservation.agent_comment" class="rounded-xl border border-border bg-card p-5"><h3 class="mb-3 flex items-center gap-2 font-semibold"><MessageSquare class="h-5 w-5 text-primary" />Commentaire de l'agent</h3><p class="text-muted-foreground">{{ reservation.agentComment || reservation.agent_comment }}</p></div>
      </div>
      <div class="lg:col-span-1"><div class="sticky top-6 rounded-xl border border-border bg-card p-5"><h3 class="mb-4 font-semibold">Resume financier</h3><div class="mb-4 space-y-3"><div class="flex justify-between text-sm"><span class="text-muted-foreground">Loyer mensuel</span><span>{{ Number(reservation.property?.price || reservation.property?.pricePerNight || 0).toLocaleString() }} FCFA</span></div><div class="flex justify-between text-sm"><span class="text-muted-foreground">Duree</span><span>{{ Math.ceil((new Date(reservation.endDate || reservation.end_date).getTime() - new Date(reservation.startDate || reservation.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)) }} mois</span></div><hr class="border-border" /><div class="flex justify-between font-semibold"><span>Total</span><span class="text-primary">{{ Number(reservation.totalPrice || reservation.total_price || 0).toLocaleString() }} FCFA</span></div></div><hr class="my-4 border-border" /><div class="space-y-3 text-sm"><div class="flex justify-between"><span class="text-muted-foreground">Reference</span><span class="font-medium">#{{ reservation.id }}</span></div><div class="flex justify-between"><span class="text-muted-foreground">Statut</span><span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="getStatusClass(reservation.status)">{{ reservation.status }}</span></div></div><div v-if="reservation.status === 'confirmee'" class="mt-4"><RouterLink :to="`/client/reclamations/nouvelle?reservation=${reservation.id}`" class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-input px-4 py-2.5 text-sm font-medium"><MessageSquare class="h-4 w-4" />Signaler un probleme</RouterLink></div></div></div>
    </div>
  </main>
</template>
