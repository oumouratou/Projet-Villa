<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { 
  Search, Eye, MessageSquare, Clock, CheckCircle2, 
  XCircle, RefreshCw, Filter, User 
} from 'lucide-vue-next'
import { getList, updateComplaint } from '@/lib/api'

const complaints = ref<any[]>([])
const loading = ref(true)
const searchTerm = ref('')
const statusFilter = ref('all')
const savingId = ref<string | null>(null)
const feedback = ref<{ id: string; msg: string; type: 'ok' | 'err' } | null>(null)

// --- Logique de normalisation ---
const getStatus = (c: any) => c.statut ?? c.status ?? 'en_attente'

const formatDate = (value: unknown) => {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value as string)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('fr-FR')
}

const getComplaintNumber = (index: number) => `N° ${String(index + 1).padStart(3, '0')}`

const clientDisplayName = (client: any) => {
  const fullName = `${client?.first_name ?? ''} ${client?.last_name ?? ''}`.trim()
  return client?.name ?? (fullName || client?.email || 'Client inconnu')
}

// --- Calculs pour les statistiques ---
const complaintsList = computed(() => (Array.isArray(complaints.value) ? complaints.value : []))
const total = computed(() => complaintsList.value.length)
const pending = computed(() => complaintsList.value.filter(c => getStatus(c) === 'en_attente').length)
const resolved = computed(() => complaintsList.value.filter(c => getStatus(c) === 'approuver').length)
const refused = computed(() => complaintsList.value.filter(c => getStatus(c) === 'refuser').length)

// --- Filtrage ---
const filtered = computed(() =>
  complaintsList.value.filter(c => {
    const matchSearch =
      c.subject?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      clientDisplayName(c.user ?? c.client).toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchStatus = statusFilter.value === 'all' || getStatus(c) === statusFilter.value
    return matchSearch && matchStatus
  })
)

// --- Styles des statuts (Couleurs identiques à la réservation) ---
const statusCls: Record<string, string> = {
  en_attente: 'bg-amber-100 text-amber-800 border-amber-200',
  approuver:  'bg-emerald-100 text-emerald-800 border-emerald-200',
  refuser:    'bg-red-100 text-red-800 border-red-200',
}
const statusLbl: Record<string, string> = {
  en_attente: 'En attente',
  approuver:  'Approuvée',
  refuser:    'Refusée',
}

// --- Actions (Même logique que réservation) ---
const handleStatus = async (complaint: any, newStatus: 'approuver' | 'refuser') => {
  savingId.value = String(complaint.id)
  feedback.value = null
  try {
    await updateComplaint({ id: String(complaint.id), status: newStatus })
    
    const idx = complaints.value.findIndex(x => x.id === complaint.id)
    if (idx !== -1) {
      complaints.value[idx] = { ...complaints.value[idx], status: newStatus, statut: newStatus }
    }

    feedback.value = {
      id: String(complaint.id),
      msg: newStatus === 'approuver' ? '✅ Réclamation approuvée' : '❌ Réclamation refusée',
      type: 'ok',
    }
    setTimeout(() => { feedback.value = null }, 3000)
  } catch (err) {
    feedback.value = { 
      id: String(complaint.id), 
      msg: 'Erreur lors de la mise à jour', 
      type: 'err' 
    }
  } finally {
    savingId.value = null
  }
}

onMounted(async () => {
  try {
    const response = await getList('/reclamations')
    complaints.value = Array.isArray(response) ? response : []
  } catch {
    complaints.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-black text-foreground">Gestion des réclamations</h1>
      <p class="mt-1 text-muted-foreground">Suivez et traitez les plaintes envoyées par vos clients</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm">
        <MessageSquare class="h-8 w-8 text-sky-500 flex-shrink-0" />
        <div><p class="text-2xl font-black">{{ total }}</p><p class="text-xs text-muted-foreground">Total</p></div>
      </div>
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm">
        <Clock class="h-8 w-8 text-amber-500 flex-shrink-0" />
        <div><p class="text-2xl font-black text-amber-600">{{ pending }}</p><p class="text-xs text-muted-foreground">En attente</p></div>
      </div>
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm">
        <CheckCircle2 class="h-8 w-8 text-emerald-500 flex-shrink-0" />
        <div><p class="text-2xl font-black text-emerald-600">{{ resolved }}</p><p class="text-xs text-muted-foreground">Approuvées</p></div>
      </div>
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3 shadow-sm">
        <XCircle class="h-8 w-8 text-red-500 flex-shrink-0" />
        <div><p class="text-2xl font-black text-red-600">{{ refused }}</p><p class="text-xs text-muted-foreground">Refusées</p></div>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 sm:flex-row shadow-sm">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input v-model="searchTerm" placeholder="Rechercher par sujet ou client..."
          class="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>
      <div class="flex items-center gap-2">
        <Filter class="h-4 w-4 text-muted-foreground" />
        <select v-model="statusFilter" class="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="approuver">Approuvée</option>
          <option value="refuser">Refusée</option>
        </select>
      </div>
    </div>

    <!-- Main Content -->
    <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div class="border-b border-border p-5 bg-muted/20">
        <h2 class="flex items-center gap-2 font-semibold">
          <MessageSquare class="h-5 w-5 text-primary" />{{ filtered.length }} réclamation(s)
        </h2>
      </div>

      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 3" :key="i" class="h-24 animate-pulse rounded-xl bg-muted" />
      </div>

      <div v-else-if="filtered.length === 0" class="p-12 text-center">
        <MessageSquare class="mx-auto mb-3 h-12 w-12 text-muted-foreground opacity-20" />
        <p class="text-muted-foreground">Aucune réclamation trouvée</p>
      </div>

      <div v-else class="divide-y divide-border">
        <div v-for="(c, index) in filtered" :key="c.id" class="p-5 hover:bg-muted/30 transition-colors">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
            
            <!-- Subject & Date -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-medium text-muted-foreground">{{ getComplaintNumber(index) }}</span>
                <span class="text-xs text-muted-foreground">•</span>
                <span class="text-xs text-muted-foreground">{{ formatDate(c.created_at || c.createdAt) }}</span>
              </div>
              <h3 class="font-bold text-foreground truncate text-lg">{{ c.subject }}</h3>
              <p class="text-sm text-muted-foreground line-clamp-1 mt-1">{{ c.description }}</p>
            </div>

            <!-- Client Info -->
            <div class="lg:w-48 flex items-center gap-2">
              <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User class="h-4 w-4 text-primary" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold truncate">{{ clientDisplayName(c.user ?? c.client) }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ (c.user ?? c.client)?.email ?? '—' }}</p>
              </div>
            </div>

            <!-- Status & Actions -->
            <div class="flex flex-wrap items-center gap-2 lg:w-64 justify-end">
              
              <!-- Feedback Message -->
              <div v-if="feedback?.id === String(c.id)"
                class="w-full mb-1 rounded-lg px-3 py-1.5 text-xs font-semibold animate-in fade-in slide-in-from-top-1"
                :class="feedback.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'">
                {{ feedback.msg }}
              </div>

              <!-- Badge Statut -->
              <span class="rounded-full px-3 py-1 text-xs font-bold border" :class="statusCls[getStatus(c)] ?? 'bg-slate-100 text-slate-600'">
                {{ statusLbl[getStatus(c)] ?? getStatus(c) }}
              </span>

              <!-- Action Buttons (Identiques aux réservations) -->
              <template v-if="getStatus(c) === 'en_attente'">
                <button @click="handleStatus(c, 'approuver')" :disabled="savingId === String(c.id)"
                  class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                  <RefreshCw v-if="savingId === String(c.id)" class="h-3 w-3 animate-spin" />
                  <CheckCircle2 v-else class="h-3 w-3" />
                  Approuver
                </button>
                <button @click="handleStatus(c, 'refuser')" :disabled="savingId === String(c.id)"
                  class="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                  <XCircle class="h-3 w-3" /> Refuser
                </button>
              </template>

              <!-- View Details -->
              <RouterLink :to="`/agent/reclamations/${c.id}`"
                class="inline-flex items-center gap-1 rounded-lg border border-input px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                <Eye class="h-3.5 w-3.5" /> Détail
              </RouterLink>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>