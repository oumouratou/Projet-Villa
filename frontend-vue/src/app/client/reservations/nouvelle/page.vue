<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { ArrowLeft, Calendar, MapPin, CheckCircle } from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { createReservation, getList } from '@/lib/api'
import { resolveImageSrc } from '@/lib/image'

const route = useRoute()
const router = useRouter()
const propertyId = computed(() => String(route.query.bien || ''))
const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref<string | null>(null)
const properties = ref<any[]>([])
const formData = reactive({ propertyId: propertyId.value, startDate: '', endDate: '', message: '' })

const selectedProperty = computed(() => properties.value.find((p) => p.id === formData.propertyId) || null)
const availableProperties = computed(() => properties.value.filter((p) => p.status === 'disponible'))
const imageSrc = (value?: string | null) => resolveImageSrc(value)

const nights = computed(() => {
  if (!formData.startDate || !formData.endDate) return 0
  const start = new Date(formData.startDate)
  const end = new Date(formData.endDate)
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Number.isFinite(diff) && diff > 0 ? diff : 0
})

const nightlyPrice = computed(() => {
  const property = selectedProperty.value
  if (!property) return 0
  return Number(property.price_per_night ?? property.price ?? 0)
})

const calculateTotal = () => nights.value * nightlyPrice.value

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  errorMessage.value = null

  if (!formData.propertyId) {
    errorMessage.value = 'Veuillez selectionner un bien.'
    return
  }
  if (!formData.startDate || !formData.endDate) {
    errorMessage.value = 'Veuillez selectionner la periode.'
    return
  }
  if (nights.value < 1) {
    errorMessage.value = 'La periode doit contenir au moins 1 nuit.'
    return
  }

  isSubmitting.value = true
  try {
    await createReservation({
      propertyId: String(formData.propertyId),
      startDate: formData.startDate,
      endDate: formData.endDate,
    })
    isSuccess.value = true
    // Redirection automatique après 2 secondes
    setTimeout(() => {
      router.push('/client/reservations')
    }, 2000)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Une erreur est survenue.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    properties.value = await getList('/properties')
  } catch {
    properties.value = []
  }
})
</script>

<template>
  <DashboardHeader title="Nouvelle reservation" subtitle="Faites une demande de reservation" />
  <main class="flex-1 p-6 overflow-auto">
    <RouterLink to="/client/recherche" class="mb-6 inline-flex items-center gap-2 text-muted-foreground"><ArrowLeft class="h-4 w-4" />Retour a la recherche</RouterLink>

    <div v-if="isSuccess" class="mx-auto max-w-lg py-12 text-center">
      <div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><CheckCircle class="h-8 w-8 text-green-600" /></div>
      <h2 class="mb-2 text-2xl font-bold">Demande envoyee !</h2>
      <p class="mb-6 text-muted-foreground">Votre demande de reservation a ete envoyee avec succes. Un agent vous contactera sous 48h.</p>
      <div class="flex justify-center gap-4"><RouterLink to="/client/reservations" class="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground">Voir mes reservations</RouterLink><RouterLink to="/client/recherche" class="rounded-lg border border-input px-6 py-2.5 font-medium">Continuer a chercher</RouterLink></div>
    </div>

    <form v-else class="max-w-3xl" @submit="handleSubmit">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div class="space-y-6 lg:col-span-3">
          <div v-if="!propertyId" class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 font-semibold">Selectionnez un bien</h3><select v-model="formData.propertyId" required class="w-full rounded-lg border border-input bg-background px-4 py-2.5"><option value="">Choisir un bien...</option><option v-for="p in availableProperties" :key="p.id" :value="p.id">{{ p.title }} - {{ p.city }} ({{ p.price }} FCFA/nuit)</option></select></div>
          <div v-if="selectedProperty" class="overflow-hidden rounded-xl border border-border bg-card"><div class="h-40"><img :src="imageSrc(selectedProperty.images?.[0])" :alt="selectedProperty.title" class="h-full w-full object-cover" /></div><div class="p-4"><h3 class="font-semibold">{{ selectedProperty.title }}</h3><p class="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin class="h-4 w-4" />{{ selectedProperty.city }}</p><p class="mt-2 font-semibold text-primary">{{ selectedProperty.price.toLocaleString() }} FCFA/nuit</p></div></div>
          <div class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 font-semibold">Periode de location</h3><div class="grid grid-cols-2 gap-4"><div><label class="mb-2 block text-sm font-medium">Date de debut</label><div class="relative"><Calendar class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input v-model="formData.startDate" type="date" required class="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4" /></div></div><div><label class="mb-2 block text-sm font-medium">Date de fin</label><div class="relative"><Calendar class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input v-model="formData.endDate" type="date" required class="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4" /></div></div></div></div>
          <div class="rounded-xl border border-border bg-card p-5"><h3 class="mb-4 font-semibold">Message (optionnel)</h3><textarea v-model="formData.message" rows="4" class="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5" placeholder="Ajoutez un message pour l'agent..."></textarea></div>
        </div>
        <div class="lg:col-span-2"><div class="sticky top-6 rounded-xl border border-border bg-card p-5"><h3 class="mb-4 font-semibold">Resume</h3><div v-if="selectedProperty" class="mb-4 space-y-3 text-sm"><div class="flex justify-between"><span class="text-muted-foreground">Prix par nuit</span><span>{{ nightlyPrice.toLocaleString() }} FCFA</span></div><div v-if="formData.startDate && formData.endDate" class="flex justify-between"><span class="text-muted-foreground">Periode</span><span>{{ nights }} nuit(s)</span></div><hr class="border-border" /><div class="flex justify-between text-base font-semibold"><span>Total estime</span><span class="text-primary">{{ calculateTotal().toLocaleString() }} FCFA</span></div></div><p v-if="errorMessage" class="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{{ errorMessage }}</p><button type="submit" :disabled="isSubmitting || !formData.startDate || !formData.endDate || nights < 1" class="w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{{ isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande' }}</button><p class="mt-3 text-center text-xs text-muted-foreground">Votre demande sera traitee sous 48h</p></div></div>
      </div>
    </form>
  </main>
</template>
