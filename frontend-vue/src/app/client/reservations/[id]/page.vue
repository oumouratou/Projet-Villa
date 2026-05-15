<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft, Calendar, MapPin, Clock, CheckCircle, XCircle,
  Ban, MessageSquare, Bed, Bath, Maximize, AlertTriangle, Home
} from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { getDetail } from '@/lib/api'
import { resolveImageSrc } from '@/lib/image'

type ReservationStatus = 'en_attente' | 'confirmee' | 'refusee' | 'annulee'

const route = useRoute()
const reservation = ref<any | null>(null)
const loading = ref(true)

const statusColors: Record<ReservationStatus, string> = {
  en_attente: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmee:  'bg-emerald-50 text-emerald-800 border-emerald-200',
  refusee:    'bg-red-50 text-red-800 border-red-200',
  annulee:    'bg-slate-100 text-slate-700 border-slate-200',
}
const statusLabels: Record<ReservationStatus, string> = {
  en_attente: 'En attente de confirmation',
  confirmee:  'Réservation confirmée ✓',
  refusee:    'Réservation refusée',
  annulee:    'Réservation annulée',
}
const statusIcons: Record<ReservationStatus, any> = {
  en_attente: Clock,
  confirmee:  CheckCircle,
  refusee:    XCircle,
  annulee:    Ban,
}

const getStatusClass = (s: string) => statusColors[s as ReservationStatus] ?? statusColors.en_attente
const getStatusIcon  = (s: string) => statusIcons[s as ReservationStatus]  ?? Clock
const getStatusLabel = (s: string) => statusLabels[s as ReservationStatus] ?? s

const nights = computed(() => {
  if (!reservation.value) return 0
  const start = new Date(reservation.value.start_date ?? reservation.value.startDate)
  const end   = new Date(reservation.value.end_date   ?? reservation.value.endDate)
  const diff  = Math.floor((end.getTime() - start.getTime()) / 86400000)
  return diff > 0 ? diff : 0
})

const reclamationUrl = computed(() =>
  `/client/reclamations/nouvelle?reservation=${reservation.value?.id}`
)

const imageSrc = (value?: string | null) => resolveImageSrc(value)

onMounted(async () => {
  try {
    reservation.value = await getDetail('/reservations', String(route.params.id))
  } catch {
    reservation.value = null
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <DashboardHeader title="Détail de la réservation" subtitle="Consultez les informations de votre réservation" />

  <main class="flex-1 overflow-auto p-6">
    <RouterLink
      to="/client/reservations"
      class="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft class="h-4 w-4" />
      Retour aux réservations
    </RouterLink>

    <div v-if="loading" class="space-y-4">
      <div class="h-16 animate-pulse rounded-xl bg-muted" />
      <div class="h-64 animate-pulse rounded-xl bg-muted" />
    </div>

    <div v-else-if="!reservation" class="rounded-xl border border-border bg-card p-10 text-center">
      <Home class="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
      <p class="text-muted-foreground">Réservation introuvable.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-3">

      <div class="space-y-6 lg:col-span-2">

        <div
          class="flex items-center gap-4 rounded-xl border-2 p-5"
          :class="getStatusClass(reservation.status)"
        >
          <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/60">
            <component :is="getStatusIcon(reservation.status)" class="h-6 w-6" />
          </div>
          <div>
            <p class="font-bold text-lg">{{ getStatusLabel(reservation.status) }}</p>
            <p v-if="reservation.status === 'en_attente'" class="text-sm opacity-75">
              Un agent examinera votre demande sous 48h
            </p>
            <p v-if="reservation.status === 'confirmee'" class="text-sm opacity-75">
              Vous pouvez signaler un problème depuis cette page
            </p>
          </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-border bg-card">
          <div class="relative h-52">
            <img
              :src="imageSrc(reservation.property?.images?.[0])"
              :alt="reservation.property?.title || 'Villa'"
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div class="absolute bottom-4 left-4 text-white">
              <p class="text-xl font-bold">{{ reservation.property?.title }}</p>
              <p class="flex items-center gap-1 text-sm opacity-90">
                <MapPin class="h-3.5 w-3.5" />{{ reservation.property?.city }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-6 p-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-1.5">
              <Maximize class="h-4 w-4" />{{ reservation.property?.surface }} m²
            </div>
            <div class="flex items-center gap-1.5">
              <Bed class="h-4 w-4" />{{ reservation.property?.bedrooms }} chambres
            </div>
            <div class="flex items-center gap-1.5">
              <Bath class="h-4 w-4" />{{ reservation.property?.bathrooms }} SDB
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-5">
          <h3 class="mb-4 font-semibold text-foreground">Période de location</h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-lg bg-muted/50 p-3 text-center">
              <p class="text-xs text-muted-foreground mb-1">Arrivée</p>
              <Calendar class="mx-auto mb-1 h-5 w-5 text-primary" />
              <p class="font-semibold text-sm">
                {{ new Date(reservation.start_date ?? reservation.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) }}
              </p>
            </div>
            <div class="rounded-lg bg-primary/10 p-3 text-center">
              <p class="text-xs text-muted-foreground mb-1">Durée</p>
              <p class="text-3xl font-black text-primary">{{ nights }}</p>
              <p class="text-xs text-muted-foreground">nuit(s)</p>
            </div>
            <div class="rounded-lg bg-muted/50 p-3 text-center">
              <p class="text-xs text-muted-foreground mb-1">Départ</p>
              <Calendar class="mx-auto mb-1 h-5 w-5 text-primary" />
              <p class="font-semibold text-sm">
                {{ new Date(reservation.end_date ?? reservation.endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="reservation.agent_comment || reservation.agentComment"
          class="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h3 class="mb-2 flex items-center gap-2 font-semibold text-blue-900">
            <MessageSquare class="h-5 w-5" />
            Commentaire de l'agent
          </h3>
          <p class="text-blue-800 text-sm leading-relaxed">
            {{ reservation.agent_comment ?? reservation.agentComment }}
          </p>
        </div>

        <!-- BOUTON RÉCLAMATION visible uniquement si réservation confirmée -->
        <div v-if="reservation.status === 'confirmee'"
          class="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 p-5">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle class="h-6 w-6 text-orange-500" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-orange-900 mb-1">Un problème avec votre séjour ?</h3>
              <p class="text-sm text-orange-700 mb-4">
                Signalez-le directement depuis cette réservation. Un agent vous répondra rapidement.
              </p>
              <RouterLink
                :to="reclamationUrl"
                class="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-sm"
              >
                <MessageSquare class="h-4 w-4" />
                Faire une réclamation
              </RouterLink>
            </div>
          </div>
        </div>

      </div>

      <div class="lg:col-span-1">
        <div class="sticky top-6 space-y-4">

          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="mb-4 font-semibold">Résumé financier</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Prix / nuit</span>
                <span>{{ Number(reservation.property?.price_per_night ?? reservation.property?.pricePerNight ?? 0).toLocaleString() }} FCFA</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Nombre de nuits</span>
                <span>{{ nights }}</span>
              </div>
              <hr class="border-border" />
              <div class="flex justify-between text-base font-bold">
                <span>Total</span>
                <span class="text-primary">{{ Number(reservation.total_price ?? reservation.totalPrice ?? 0).toLocaleString() }} FCFA</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="mb-4 font-semibold">Informations</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Référence</span>
                <span class="font-mono font-medium">#{{ reservation.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Demandée le</span>
                <span>{{ new Date(reservation.created_at ?? reservation.createdAt).toLocaleDateString('fr-FR') }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-muted-foreground">Statut</span>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold border"
                  :class="getStatusClass(reservation.status)"
                >{{ reservation.status }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="mb-3 font-semibold">Actions</h3>
            <div class="space-y-2">
              <RouterLink
                to="/client/recherche"
                class="flex w-full items-center gap-2 rounded-lg border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                <Home class="h-4 w-4" />
                Rechercher un bien
              </RouterLink>
              <RouterLink
                v-if="reservation.status === 'confirmee'"
                :to="reclamationUrl"
                class="flex w-full items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
              >
                <MessageSquare class="h-4 w-4" />
                Faire une réclamation
              </RouterLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>