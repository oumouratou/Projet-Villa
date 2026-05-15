<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { ArrowLeft, MessageSquare, CheckCircle } from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { createComplaint, fetchCurrentUser, getList } from '@/lib/api'
import { getStoredToken, getStoredRole, getUserRole, setSession } from '@/lib/session'

const route = useRoute()
const router = useRouter()
const reservationId = computed(() => String(route.query.reservation || ''))
const isSubmitting = ref(false)
const isSuccess = ref(false)
const errors = ref<Record<string, string>>({})
const submitError = ref<string | null>(null)
const reservations = ref<any[]>([])
const formData = reactive({ reservationId: reservationId.value, subject: '', description: '' })

const reservationStatus = (reservation: any) => reservation.statut ?? reservation.status ?? 'en_attente'
const reservationProperty = (reservation: any) => reservation.property ?? reservation.bien ?? null

const clientReservations = computed(() =>
  (Array.isArray(reservations.value) ? reservations.value : []).filter((reservation) => reservationStatus(reservation) === 'confirmee')
)

const reservationLabel = (reservation: any) => {
  const property = reservationProperty(reservation)
  const title = property?.title ?? property?.titre ?? `Réservation #${reservation.id}`
  const dateValue = reservation.date_debut ?? reservation.start_date ?? reservation.startDate
  const formattedDate = dateValue ? new Date(dateValue).toLocaleDateString('fr-FR') : 'date inconnue'

  return `${title} - ${formattedDate}`
}

const validate = () => {
  const newErrors: Record<string, string> = {}
  if (!String(formData.reservationId || '').trim()) newErrors.reservationId = 'Veuillez selectionner une reservation'
  if (!formData.subject.trim()) newErrors.subject = 'Le sujet est requis'
  if (!formData.description.trim()) newErrors.description = 'La description est requise'
  else if (formData.description.trim().length < 20) newErrors.description = 'La description doit contenir au moins 20 caracteres'
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!validate()) return

  submitError.value = null
  isSubmitting.value = true
  try {
    await createComplaint({
      reservationId: String(formData.reservationId),
      subject: formData.subject,
      description: formData.description,
    })
    isSuccess.value = true
    setTimeout(() => {
      router.push('/client/reclamations')
    }, 1500)
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Une erreur est survenue.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  const token = getStoredToken()
  let role = getStoredRole()

  if (token && !role) {
    try {
      const currentUser = await fetchCurrentUser()
      if (currentUser) {
        setSession(token, currentUser)
        role = getUserRole(currentUser)
      }
    } catch {
      role = null
    }
  }

  if (!token || role !== 'client') {
    router.replace({ path: '/connexion', query: { redirect: '/client/reclamations/nouvelle' } })
    return
  }

  try {
    const response = await getList('/reservations')
    reservations.value = Array.isArray(response) ? response : ((response as any)?.data ?? [])
  } catch {
    reservations.value = []
  }
})
</script>

<template>
  <DashboardHeader title="Nouvelle reclamation" subtitle="Signalez un probleme ou posez une question" />
  <main class="flex-1 p-6 overflow-auto">
    <RouterLink to="/client/reclamations" class="mb-6 inline-flex items-center gap-2 text-muted-foreground"><ArrowLeft class="h-4 w-4" />Retour aux reclamations</RouterLink>

    <div v-if="isSuccess" class="mx-auto max-w-lg py-12 text-center">
      <div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><CheckCircle class="h-8 w-8 text-green-600" /></div>
      <h2 class="mb-2 text-2xl font-bold">Reclamation envoyee !</h2>
      <p class="mb-6 text-muted-foreground">Votre reclamation a ete envoyee avec succes. Un agent vous repondra dans les plus brefs delais.</p>
      <div class="flex justify-center gap-4"><RouterLink to="/client/reclamations" class="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground">Voir mes reclamations</RouterLink><RouterLink to="/client" class="rounded-lg border border-input px-6 py-2.5 font-medium">Retour au tableau de bord</RouterLink></div>
    </div>

    <form v-else class="max-w-2xl" @submit="handleSubmit">
      <div class="space-y-6">
        <div class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 font-semibold">Réservation concernée</h3><select v-model="formData.reservationId" class="w-full rounded-lg border px-4 py-2.5" :class="errors.reservationId ? 'border-red-500' : 'border-input'"><option value="">Sélectionner une réservation...</option><option v-for="res in clientReservations" :key="res.id" :value="res.id">{{ reservationLabel(res) }}</option></select><p v-if="errors.reservationId" class="mt-1 text-sm text-red-600">{{ errors.reservationId }}</p><p v-if="!clientReservations.length" class="mt-2 text-xs text-amber-700">Aucune réservation confirmée disponible pour créer une réclamation.</p><p class="mt-2 text-xs text-muted-foreground">Choisissez une reservation afin que l'agent puisse traiter votre demande.</p></div>
        <div class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 font-semibold">Sujet de la reclamation</h3><input v-model="formData.subject" type="text" class="w-full rounded-lg border px-4 py-2.5" :class="errors.subject ? 'border-red-500' : 'border-input'" placeholder="Ex: Probleme de chauffage, Fuite d'eau..." /><p v-if="errors.subject" class="mt-1 text-sm text-red-600">{{ errors.subject }}</p></div>
        <div class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 font-semibold">Description detaillee</h3><textarea v-model="formData.description" rows="6" class="w-full resize-none rounded-lg border px-4 py-2.5" :class="errors.description ? 'border-red-500' : 'border-input'" placeholder="Decrivez votre probleme en detail..."></textarea><p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p><p class="mt-2 text-xs text-muted-foreground">{{ formData.description.length }}/500 caracteres</p></div>
        <p v-if="submitError" class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{{ submitError }}</p>
        <div class="flex gap-4"><RouterLink to="/client/reclamations" class="rounded-lg border border-input px-6 py-2.5 font-medium">Annuler</RouterLink><button type="submit" :disabled="isSubmitting" class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground"><MessageSquare class="h-5 w-5" />{{ isSubmitting ? 'Envoi en cours...' : 'Envoyer la reclamation' }}</button></div>
      </div>
    </form>
  </main>
</template>
