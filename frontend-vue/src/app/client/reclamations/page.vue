<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { MessageSquare, Plus, Search, Filter, Eye, AlertCircle, CheckCircle } from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { getList } from '@/lib/api'

const statusFilter = ref('all')
const searchQuery = ref('')
const complaints = ref<any[]>([])

const complaintStatus = (complaint: any) => complaint.statut ?? complaint.status ?? 'en_attente'
const safeText = (value: unknown) => (typeof value === 'string' ? value : '')

const formatDate = (value: unknown) => {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value as string)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('fr-FR')
}

const getComplaintNumber = (index: number) => `N° ${String(index + 1).padStart(3, '0')}`

const filteredComplaints = computed(() => {
  return (Array.isArray(complaints.value) ? complaints.value : []).filter((complaint) => {
    const currentStatus = complaintStatus(complaint)
    const matchesStatus = statusFilter.value === 'all' || currentStatus === statusFilter.value
    const matchesSearch = !searchQuery.value
      || safeText(complaint.subject).toLowerCase().includes(searchQuery.value.toLowerCase())
      || safeText(complaint.description).toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesStatus && matchesSearch
  })
})

const statusColors: Record<string, string> = {
  en_attente: 'bg-blue-100 text-blue-800',
  approuver: 'bg-green-100 text-green-800',
  refuser: 'bg-red-100 text-red-800',
}
const statusLabels: Record<string, string> = { en_attente: 'En attente', approuver: 'Approuvée', refuser: 'Refusée' }
const statusIcons: Record<string, any> = { en_attente: AlertCircle, approuver: CheckCircle, refuser: AlertCircle }

onMounted(async () => {
  try {
    const response = await getList('/reclamations')
    complaints.value = Array.isArray(response) ? response : []
  } catch {
    complaints.value = []
  }
})
</script>

<template>
  <DashboardHeader title="Mes reclamations" subtitle="Gerez et suivez vos reclamations" />
  <main class="flex-1 overflow-auto p-6">
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div class="grid grid-cols-3 gap-4">
        <div class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100"><AlertCircle class="h-5 w-5 text-blue-600" /></div><div><p class="text-xl font-bold">{{ (Array.isArray(complaints) ? complaints : []).filter(c => complaintStatus(c) === 'en_attente').length }}</p><p class="text-xs text-muted-foreground">En attente</p></div></div></div>
        <div class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100"><CheckCircle class="h-5 w-5 text-green-600" /></div><div><p class="text-xl font-bold">{{ (Array.isArray(complaints) ? complaints : []).filter(c => complaintStatus(c) === 'approuver').length }}</p><p class="text-xs text-muted-foreground">Approuvées</p></div></div></div>
        <div class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100"><AlertCircle class="h-5 w-5 text-red-600" /></div><div><p class="text-xl font-bold">{{ (Array.isArray(complaints) ? complaints : []).filter(c => complaintStatus(c) === 'refuser').length }}</p><p class="text-xs text-muted-foreground">Refusées</p></div></div></div>
      </div>
      <RouterLink to="/client/reclamations/nouvelle" class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground"><Plus class="h-5 w-5" />Nouvelle reclamation</RouterLink>
    </div>

    <div class="mb-6 rounded-xl border border-border bg-card p-4">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="relative flex-1"><Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input v-model="searchQuery" type="text" placeholder="Rechercher une reclamation..." class="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4" /></div>
        <div class="flex items-center gap-2"><Filter class="h-5 w-5 text-muted-foreground" /><select v-model="statusFilter" class="rounded-lg border border-input bg-background px-4 py-2.5"><option value="all">Tous les statuts</option><option value="en_attente">En attente</option><option value="approuver">Approuvées</option><option value="refuser">Refusées</option></select></div>
      </div>
    </div>

    <div v-if="(filteredComplaints?.length ?? 0) > 0" class="space-y-4">
      <div v-for="(complaint, index) in filteredComplaints" :key="complaint.id" class="rounded-xl border border-border bg-card p-5">
        <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div class="flex items-start gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted"><MessageSquare class="h-6 w-6 text-muted-foreground" /></div><div class="flex-1"><h3 class="mb-1 font-semibold">{{ safeText(complaint.subject) }}</h3><p class="mb-2 line-clamp-2 text-sm text-muted-foreground">{{ safeText(complaint.description) }}</p><p class="text-xs text-muted-foreground">{{ getComplaintNumber(index) }} · Cree le {{ formatDate(complaint.created_at || complaint.createdAt || Date.now()) }}<span v-if="complaint.reservation"> · Lie a la reservation {{ getComplaintNumber(index) }}</span></p></div></div>
          <div class="flex items-center gap-3"><span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium" :class="statusColors[complaintStatus(complaint)]"><component :is="statusIcons[complaintStatus(complaint)]" class="h-4 w-4" />{{ statusLabels[complaintStatus(complaint)] }}</span><RouterLink :to="`/client/reclamations/${complaint.id}`" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Eye class="h-4 w-4" />Details</RouterLink></div>
        </div>
        <div v-if="complaint.agent_response || complaint.agentResponse" class="mt-4 border-t border-border pt-4 text-sm"><span class="font-medium">Reponse de l'agent :</span> <span class="text-muted-foreground">{{ complaint.agent_response || complaint.agentResponse }}</span></div>
      </div>
    </div>

    <div v-else class="rounded-xl border border-border bg-card py-16 text-center"><MessageSquare class="mx-auto mb-4 h-12 w-12 text-muted-foreground" /><h3 class="mb-2 text-lg font-semibold">Aucune reclamation trouvee</h3><p class="mb-4 text-muted-foreground">Vous n'avez pas encore de reclamation</p><RouterLink to="/client/reclamations/nouvelle" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"><Plus class="h-4 w-4" />Nouvelle reclamation</RouterLink></div>
  </main>
</template>