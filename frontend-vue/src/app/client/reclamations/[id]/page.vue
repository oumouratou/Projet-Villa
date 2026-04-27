<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, MessageSquare, Clock, AlertCircle, CheckCircle, Calendar, Home, User } from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { getDetail } from '@/lib/api'

const route = useRoute()
const complaint = ref<any | null>(null)

const statusColors: Record<string, string> = {
  nouvelle: 'bg-blue-100 text-blue-800 border-blue-200',
  ouverte: 'bg-blue-100 text-blue-800 border-blue-200',
  en_cours: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  traitee: 'bg-green-100 text-green-800 border-green-200',
}
const statusLabels: Record<string, string> = {
  nouvelle: 'Nouvelle - En attente de traitement',
  ouverte: 'Ouverte - En attente de traitement',
  en_cours: 'En cours de traitement',
  traitee: 'Reclamation traitee',
}
const statusIcons: Record<string, any> = { nouvelle: AlertCircle, ouverte: AlertCircle, en_cours: Clock, traitee: CheckCircle }

onMounted(async () => {
  try {
    complaint.value = await getDetail('/complaints', String(route.params.id))
  } catch {
    complaint.value = null
  }
})
</script>

<template>
  <DashboardHeader title="Detail de la reclamation" />
  <main class="flex-1 p-6 overflow-auto">
    <RouterLink to="/client/reclamations" class="mb-6 inline-flex items-center gap-2 text-muted-foreground"><ArrowLeft class="h-4 w-4" />Retour aux reclamations</RouterLink>
    <div v-if="!complaint" class="rounded-xl border border-border bg-card p-6">Reclamation introuvable.</div>
    <div v-else class="max-w-3xl space-y-6">
      <div class="flex items-center gap-3 rounded-xl border p-4" :class="statusColors[complaint.status]"><component :is="statusIcons[complaint.status]" class="h-6 w-6" /><div><p class="font-semibold">{{ statusLabels[complaint.status] }}</p><p v-if="complaint.status === 'nouvelle'" class="text-sm opacity-80">Votre reclamation sera traitee dans les plus brefs delais</p><p v-if="complaint.status === 'en_cours'" class="text-sm opacity-80">Un agent travaille sur votre demande</p></div></div>
      <div class="rounded-xl border border-border bg-card">
        <div class="border-b border-border p-5"><div class="flex items-start gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><MessageSquare class="h-6 w-6 text-primary" /></div><div><h2 class="text-xl font-semibold">{{ complaint.subject }}</h2><p class="mt-1 text-sm text-muted-foreground">Reference: #{{ complaint.id }}</p></div></div></div>
        <div class="p-5"><h3 class="mb-2 text-sm font-medium text-muted-foreground">Description</h3><p class="leading-relaxed text-foreground">{{ complaint.description }}</p></div>
      </div>
      <div v-if="complaint.reservation" class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 flex items-center gap-2 font-semibold"><Home class="h-5 w-5 text-primary" />Reservation associee</h3><RouterLink :to="`/client/reservations/${complaint.reservationId}`" class="flex items-center gap-4 rounded-lg bg-muted/50 p-4"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-card"><Home class="h-6 w-6 text-muted-foreground" /></div><div><p class="font-medium">{{ complaint.reservation.property?.title }}</p><p class="text-sm text-muted-foreground">{{ complaint.reservation.startDate.toLocaleDateString('fr-FR') }} - {{ complaint.reservation.endDate.toLocaleDateString('fr-FR') }}</p></div></RouterLink></div>
      <div v-if="complaint.agentResponse" class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 flex items-center gap-2 font-semibold"><User class="h-5 w-5 text-primary" />Reponse de l'agent</h3><div class="rounded-lg bg-muted/50 p-4"><p>{{ complaint.agentResponse }}</p><p class="mt-3 text-xs text-muted-foreground">Repondu le {{ complaint.updatedAt.toLocaleDateString('fr-FR') }}</p></div></div>
      <div class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 flex items-center gap-2 font-semibold"><Calendar class="h-5 w-5 text-primary" />Historique</h3><div class="space-y-4"><div class="flex gap-4"><div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100"><AlertCircle class="h-5 w-5 text-blue-600" /></div><div><p class="font-medium">Reclamation creee</p><p class="text-sm text-muted-foreground">{{ complaint.createdAt.toLocaleDateString('fr-FR') }}</p></div></div><div v-if="complaint.status !== 'nouvelle'" class="flex gap-4"><div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100"><Clock class="h-5 w-5 text-yellow-600" /></div><div><p class="font-medium">Prise en charge</p><p class="text-sm text-muted-foreground">Un agent a pris en charge votre reclamation</p></div></div><div v-if="complaint.status === 'traitee'" class="flex gap-4"><div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100"><CheckCircle class="h-5 w-5 text-green-600" /></div><div><p class="font-medium">Reclamation traitee</p><p class="text-sm text-muted-foreground">{{ complaint.updatedAt.toLocaleDateString('fr-FR') }}</p></div></div></div></div>
    </div>
  </main>
</template>
