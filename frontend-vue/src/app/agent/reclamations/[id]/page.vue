<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft, MessageSquare, User, Calendar, CheckCircle2,
  Clock, AlertCircle, Send, Home, RefreshCw
} from 'lucide-vue-next'
import { getDetail, updateComplaint } from '@/lib/api'

const route  = useRoute()
const complaint = ref<any | null>(null)
const loading   = ref(true)
const saving    = ref(false)
const feedback  = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const agentResponse = ref('')
const newStatus     = ref('')

const statusOpts = [
  { value: 'en_attente', label: 'En attente',  cls: 'bg-blue-100 text-blue-800' },
  { value: 'approuver',  label: 'Approuver',   cls: 'bg-green-100 text-green-800' },
  { value: 'refuser',    label: 'Refuser',     cls: 'bg-red-100 text-red-800' },
]

const currentStatusCls = computed(() => {
  const s = complaint.value?.statut ?? complaint.value?.status ?? 'en_attente'
  return statusOpts.find(o => o.value === s)?.cls ?? 'bg-slate-100 text-slate-700'
})
const currentStatusLabel = computed(() => {
  const s = complaint.value?.statut ?? complaint.value?.status ?? 'en_attente'
  return statusOpts.find(o => o.value === s)?.label ?? s
})
const clientName = computed(() => {
  const c = complaint.value?.client
  if (!c) return 'Client inconnu'
  return c.name ?? (`${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() || c.email)
})
const reservationTitle = computed(() => {
  const r = complaint.value?.reservation
  if (!r) return null
  return r.bien?.title ?? r.property?.title ?? `Réservation #${r.id}`
})

const load = async () => {
  loading.value = true
  feedback.value = null
  try {
    complaint.value = await getDetail('/reclamations', String(route.params.id))
    agentResponse.value = complaint.value?.agent_response ?? complaint.value?.agentResponse ?? ''
    newStatus.value     = complaint.value?.statut ?? complaint.value?.status ?? 'en_attente'
  } catch {
    complaint.value = null
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  if (!complaint.value) return
  saving.value   = true
  feedback.value = null
  try {
    await updateComplaint({
      id:          String(complaint.value.id),
      status:      newStatus.value as 'en_attente' | 'approuver' | 'refuser',
      description: agentResponse.value,
    })
    // recharger les données pour uniformiser
    complaint.value = await getDetail('/reclamations', String(route.params.id))
    feedback.value  = { type: 'success', text: 'Réclamation mise à jour avec succès !' }
  } catch (err) {
    feedback.value = { type: 'error', text: err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.' }
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6 p-6">

    <div class="flex items-center gap-4">
      <RouterLink to="/agent/reclamations"
        class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft class="h-4 w-4" />Retour aux réclamations
      </RouterLink>
    </div>

    <div>
      <h1 class="text-2xl font-bold text-foreground">Traiter la réclamation</h1>
      <p class="text-muted-foreground text-sm mt-1">Consultez les détails et répondez au client</p>
    </div>

    <div v-if="loading" class="space-y-4">
      <div class="h-32 animate-pulse rounded-xl bg-muted" />
      <div class="h-48 animate-pulse rounded-xl bg-muted" />
    </div>

    <div v-else-if="!complaint" class="rounded-xl border border-border bg-card p-10 text-center">
      <MessageSquare class="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
      <p class="text-muted-foreground">Réclamation introuvable.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-3">

      <div class="space-y-6 lg:col-span-2">

        <div class="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div class="flex items-center gap-3">
            <CheckCircle2 v-if="complaint.statut === 'approuver'" class="h-6 w-6 text-green-600" />
            <AlertCircle v-else-if="complaint.statut === 'refuser'" class="h-6 w-6 text-red-600" />
            <Clock v-else class="h-6 w-6 text-blue-600" />
            <div>
              <p class="font-semibold text-foreground">Réclamation #{{ complaint.id }}</p>
              <p class="text-xs text-muted-foreground">
                Déposée le {{ new Date(complaint.created_at ?? complaint.createdAt).toLocaleDateString('fr-FR') }}
              </p>
            </div>
          </div>
          <span class="rounded-full px-3 py-1.5 text-xs font-bold" :class="currentStatusCls">
            {{ currentStatusLabel }}
          </span>
        </div>

        <div class="rounded-xl border border-border bg-card p-5">
          <h3 class="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <User class="h-5 w-5 text-primary" />Client concerné
          </h3>
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {{ clientName.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-semibold text-foreground text-lg">{{ clientName }}</p>
              <p class="text-sm text-muted-foreground">{{ complaint.client?.email ?? '—' }}</p>
              <p v-if="complaint.client?.phone" class="text-sm text-muted-foreground">📞 {{ complaint.client.phone }}</p>
            </div>
          </div>
        </div>

        <div v-if="complaint.reservation" class="rounded-xl border border-border bg-card p-5">
          <h3 class="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Calendar class="h-5 w-5 text-primary" />Réservation concernée
          </h3>
          <div class="flex items-center gap-4 rounded-lg bg-muted/40 p-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Home class="h-6 w-6 text-primary" />
            </div>
            <div class="flex-1">
              <p class="font-semibold">{{ reservationTitle }}</p>
              <p class="text-sm text-muted-foreground">
                Réservation #{{ complaint.reservation.id }}
                <span v-if="complaint.reservation.date_debut">
                  — du {{ new Date(complaint.reservation.date_debut).toLocaleDateString('fr-FR') }}
                  au {{ new Date(complaint.reservation.date_fin).toLocaleDateString('fr-FR') }}
                </span>
              </p>
            </div>
            <RouterLink :to="`/agent/reservations/${complaint.reservation.id}`"
              class="rounded-lg border border-input px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
              Voir →
            </RouterLink>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-5">
          <h3 class="mb-3 flex items-center gap-2 font-semibold text-foreground">
            <MessageSquare class="h-5 w-5 text-primary" />Objet de la réclamation
          </h3>
          <p class="mb-3 text-lg font-semibold text-foreground">{{ complaint.subject ?? complaint.sujet }}</p>
          <div class="rounded-lg bg-muted/40 p-4">
            <p class="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {{ complaint.description ?? complaint.message }}
            </p>
          </div>
        </div>

        <div class="rounded-xl border-2 border-primary/20 bg-card p-5">
          <h3 class="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Send class="h-5 w-5 text-primary" />Votre réponse au client
          </h3>

          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-foreground">Statut</label>
            <div class="flex gap-3">
              <button v-for="opt in statusOpts" :key="opt.value" type="button"
                @click="newStatus = opt.value"
                class="rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all"
                :class="newStatus === opt.value ? 'border-primary bg-primary text-white' : 'border-input bg-background text-foreground hover:border-primary/50'">
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-foreground">Message de réponse</label>
            <textarea v-model="agentResponse" rows="5" placeholder="Rédigez votre réponse au client..."
              class="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <div v-if="feedback" class="mb-4 rounded-lg px-4 py-3 text-sm font-medium"
            :class="feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'">
            {{ feedback.text }}
          </div>

          <button @click="submit" :disabled="saving"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
            <RefreshCw v-if="saving" class="h-4 w-4 animate-spin" />
            <Send v-else class="h-4 w-4" />
            {{ saving ? 'Sauvegarde...' : 'Enregistrer la réponse' }}
          </button>
        </div>

      </div>

      <div class="lg:col-span-1">
        <div class="sticky top-6 rounded-xl border border-border bg-card p-5 space-y-4">
          <h3 class="font-semibold text-foreground">Récapitulatif</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between"><span class="text-muted-foreground">Référence</span><span class="font-mono">#{{ complaint.id }}</span></div>
            <div class="flex justify-between"><span class="text-muted-foreground">Client</span><span class="font-medium">{{ clientName }}</span></div>
            <div class="flex justify-between"><span class="text-muted-foreground">Réservation</span><span>#{{ complaint.reservation?.id ?? '—' }}</span></div>
            <div class="flex justify-between items-center">
              <span class="text-muted-foreground">Statut</span>
              <span class="rounded-full px-2.5 py-1 text-xs font-bold" :class="currentStatusCls">{{ currentStatusLabel }}</span>
            </div>
            <div class="flex justify-between"><span class="text-muted-foreground">Déposée le</span><span>{{ new Date(complaint.created_at ?? complaint.createdAt).toLocaleDateString('fr-FR') }}</span></div>
          </div>
          <hr class="border-border" />
          <div v-if="complaint.agent_response || complaint.agentResponse" class="rounded-lg bg-green-50 p-3">
            <p class="text-xs font-semibold text-green-800 mb-1">Réponse envoyée</p>
            <p class="text-xs text-green-700 line-clamp-3">{{ complaint.agent_response ?? complaint.agentResponse }}</p>
          </div>
          <div v-else class="rounded-lg bg-amber-50 p-3">
            <p class="text-xs font-semibold text-amber-800">En attente de réponse</p>
            <p class="text-xs text-amber-700 mt-0.5">Aucune réponse envoyée</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>