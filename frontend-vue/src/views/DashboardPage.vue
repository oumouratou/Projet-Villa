<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getDashboardStats } from '../lib/api'
import type { DashboardStats } from '../types'

const props = withDefaults(
  defineProps<{
    role?: 'admin' | 'agent' | 'client'
  }>(),
  {
    role: 'admin',
  },
)

const roleTitles: Record<'admin' | 'agent' | 'client', string> = {
  admin: 'Tableau de bord Administrateur',
  agent: 'Tableau de bord Agent',
  client: 'Tableau de bord Client',
}

const loading = ref(true)
const error = ref<string | null>(null)
const stats = ref<DashboardStats | null>(null)

onMounted(async () => {
  try {
    stats.value = await getDashboardStats()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de chargement'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="space-y-6">
    <h1 class="text-3xl font-semibold tracking-tight">{{ roleTitles[props.role] }}</h1>

    <p v-if="loading" class="text-sm text-slate-500">Chargement...</p>
    <p v-else-if="error" class="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">{{ error }}</p>

    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article class="metric-card">
        <h2>Total biens</h2>
        <strong>{{ stats?.totalProperties }}</strong>
      </article>
      <article class="metric-card">
        <h2>Total reservations</h2>
        <strong>{{ stats?.totalReservations }}</strong>
      </article>
      <article class="metric-card">
        <h2>Reservations en attente</h2>
        <strong>{{ stats?.pendingReservations }}</strong>
      </article>
      <article class="metric-card">
        <h2>Clients</h2>
        <strong>{{ stats?.totalClients }}</strong>
      </article>
      <article class="metric-card">
        <h2>Chiffre confirme</h2>
        <strong>{{ stats?.totalRevenue?.toLocaleString('fr-FR') }} FCFA</strong>
      </article>
      <article class="metric-card">
        <h2>Taux occupation</h2>
        <strong>{{ stats?.occupancyRate }}%</strong>
      </article>
    </div>
  </section>
</template>
