<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, Home, MessageSquare, XCircle } from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { getDetail, updateReservation } from '@/lib/api'

const route = useRoute()
const loading = ref(true)
const saving = ref(false)
const feedback = ref<string | null>(null)
const reservation = ref<any | null>(null)

const reservationId = computed(() => String(route.params.id ?? ''))

const loadReservation = async () => {
  loading.value = true
  feedback.value = null

  try {
    reservation.value = await getDetail('/reservations', reservationId.value)
  } catch (error) {
    feedback.value = error instanceof Error ? error.message : 'Impossible de charger la reservation.'
    reservation.value = null
  } finally {
    loading.value = false
  }
}

const setStatus = async (status: 'confirmee' | 'refusee') => {
  if (!reservation.value) return

  saving.value = true
  feedback.value = null

  try {
    reservation.value = await updateReservation({ id: reservationId.value, status })
    feedback.value = status === 'confirmee' ? 'Reservation acceptee.' : 'Reservation refusee.'
  } catch (error) {
    feedback.value = error instanceof Error ? error.message : 'Action impossible.'
  } finally {
    saving.value = false
  }
}

onMounted(loadReservation)
</script>

<template>
  <DashboardHeader title="Detail reservation" subtitle="Traitez la demande attribuee a votre compte agent" />

  <main class="flex-1 overflow-auto p-6">
    <RouterLink to="/agent/reservations" class="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft class="h-4 w-4" />
      Retour aux reservations
    </RouterLink>

    <div v-if="loading" class="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
      Chargement...
    </div>

    <div v-else-if="!reservation" class="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
      Reservation introuvable.
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <section class="space-y-6 rounded-xl border border-border bg-card p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Reservation #{{ reservation.id }}</p>
            <h1 class="mt-2 text-3xl font-bold text-foreground">{{ reservation.property?.title }}</h1>
            <p class="mt-1 text-muted-foreground">{{ reservation.property?.city }}</p>
          </div>
          <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
                :class="reservation.status === 'confirmee' ? 'bg-green-100 text-green-700' : reservation.status === 'refusee' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'">
            <Clock v-if="reservation.status === 'en_attente'" class="h-4 w-4" />
            <CheckCircle2 v-else-if="reservation.status === 'confirmee'" class="h-4 w-4" />
            <XCircle v-else class="h-4 w-4" />
            {{ reservation.status }}
          </span>
        </div>

        <div v-if="feedback" class="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          {{ feedback }}
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <article class="rounded-2xl border border-border bg-background p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Client</p>
            <p class="mt-2 font-semibold">{{ reservation.client?.first_name ?? reservation.client?.firstName }} {{ reservation.client?.last_name ?? reservation.client?.lastName }}</p>
            <p class="text-sm text-muted-foreground">{{ reservation.client?.email }}</p>
          </article>
          <article class="rounded-2xl border border-border bg-background p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Agent assigné</p>
            <p class="mt-2 font-semibold">{{ reservation.agent?.name ?? 'Non défini' }}</p>
            <p class="text-sm text-muted-foreground">{{ reservation.agent?.email ?? 'Aucun agent' }}</p>
          </article>
          <article class="rounded-2xl border border-border bg-background p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dates</p>
            <p class="mt-2 font-semibold">{{ new Date(reservation.start_date || reservation.startDate).toLocaleDateString('fr-FR') }}</p>
            <p class="text-sm text-muted-foreground">au {{ new Date(reservation.end_date || reservation.endDate).toLocaleDateString('fr-FR') }}</p>
          </article>
          <article class="rounded-2xl border border-border bg-background p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Montant</p>
            <p class="mt-2 font-semibold">{{ Number(reservation.total_price || reservation.totalPrice || 0).toLocaleString() }} FCFA</p>
          </article>
        </div>

        <article v-if="reservation.commentaire_agent || reservation.agent_comment" class="rounded-2xl border border-border bg-background p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Commentaire agent</p>
          <p class="mt-2 text-sm text-foreground">{{ reservation.commentaire_agent || reservation.agent_comment }}</p>
        </article>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            :disabled="saving || reservation.status === 'confirmee'"
            class="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            @click="setStatus('confirmee')"
          >
            <CheckCircle2 class="h-4 w-4" />
            Accepter
          </button>
          <button
            type="button"
            :disabled="saving || reservation.status === 'refusee'"
            class="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            @click="setStatus('refusee')"
          >
            <XCircle class="h-4 w-4" />
            Refuser
          </button>
        </div>
      </section>

      <aside class="space-y-6">
        <article class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Home class="h-6 w-6 text-primary" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Bien concerné</p>
              <p class="font-semibold">{{ reservation.property?.title }}</p>
            </div>
          </div>
          <div class="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>Ville: {{ reservation.property?.city }}</p>
            <p>Reference: #{{ reservation.property_id || reservation.propertyId }}</p>
          </div>
        </article>

        <article class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
              <CalendarDays class="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Statut métier</p>
              <p class="font-semibold capitalize">{{ reservation.status }}</p>
            </div>
          </div>
          <p class="mt-4 text-sm text-muted-foreground">
            Une fois la reservation acceptee, le client voit la confirmation dans son espace.
          </p>
        </article>

        <article class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
              <MessageSquare class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Client</p>
              <p class="font-semibold">{{ reservation.client?.email }}</p>
            </div>
          </div>
        </article>
      </aside>
    </div>
  </main>
</template>
