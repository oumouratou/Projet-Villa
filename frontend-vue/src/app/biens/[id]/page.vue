<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Bath, BedDouble, CalendarDays,
  Car, ChevronLeft, ChevronRight, Heart, MapPin, Maximize,
  ShieldCheck, Users, Waves, Wind, Wifi,
  Droplet, Trees, LogIn, UserPlus, Sparkles, Star,
} from 'lucide-vue-next'
import { createReservation, getProperty } from '@/lib/api'
import { getStoredToken } from '@/lib/session'

const route  = useRoute()
const router = useRouter()

const property         = ref<any | null>(null)
const loading          = ref(true)
const activeImageIndex = ref(0)
const isFavorite       = ref(false)
let   slideshowTimer: ReturnType<typeof setInterval> | null = null

const reservationForm = reactive({ startDate: '', endDate: '' })
const bookingSubmitting = ref(false)
const bookingSuccess    = ref(false)
const bookingError      = ref<string | null>(null)

const isLoggedIn = computed(() => Boolean(getStoredToken()))

const reservationPageUrl = computed(() =>
  `/client/reservations/nouvelle?bien=${route.params.id}`
)
const loginUrl = computed(() =>
  `/connexion?redirect=${encodeURIComponent(reservationPageUrl.value)}`
)
const registerUrl = computed(() =>
  `/inscription?redirect=${encodeURIComponent(reservationPageUrl.value)}`
)

const fallbackGallery = [
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
]

const galleryImages = computed<string[]>(() => {
  const base = property.value?.images?.filter(Boolean) ?? []
  const imgs = base.length >= 5 ? base : [
    ...base,
    ...fallbackGallery.slice(base.length),
  ]
  return imgs.slice(0, 5)
})

const mainImage = computed(() =>
  galleryImages.value[activeImageIndex.value % galleryImages.value.length]
)

const startSlideshow = () => {
  slideshowTimer = setInterval(() => {
    activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length
  }, 3500)
}
const stopSlideshow = () => {
  if (slideshowTimer) { clearInterval(slideshowTimer); slideshowTimer = null }
}
const goPrev = () => {
  stopSlideshow()
  activeImageIndex.value = (activeImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}
const goNext = () => {
  stopSlideshow()
  activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length
}

const iconMap: Record<string, any> = {
  wifi: Wifi, 'wi-fi': Wifi,
  piscine: Waves, pool: Waves, waves: Waves,
  parking: Car, garage: Car, car: Car,
  jardin: Trees, garden: Trees, trees: Trees,
  climatisation: Wind, 'air conditionné': Wind, wind: Wind,
  spa: Droplet, droplet: Droplet,
}
const getOptionIcon = (name: string) => iconMap[name.toLowerCase().trim()] ?? Sparkles

const statusLabels: Record<string, string> = {
  disponible: 'Disponible', reserve: 'Réservé', maintenance: 'Maintenance',
}
const statusClasses: Record<string, string> = {
  disponible: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  reserve:    'bg-sky-100 text-sky-700 border border-sky-200',
  maintenance:'bg-slate-100 text-slate-600 border border-slate-200',
}

const bookingNights = computed(() => {
  if (!reservationForm.startDate || !reservationForm.endDate) return 0
  const diff = Math.floor(
    (new Date(reservationForm.endDate).getTime() - new Date(reservationForm.startDate).getTime())
    / 86400000
  )
  return diff > 0 ? diff : 0
})
const bookingTotal = computed(() =>
  bookingNights.value * Number(property.value?.pricePerNight ?? 0)
)
const minDate = computed(() => new Date().toISOString().split('T')[0])

const submitBooking = async () => {
  bookingError.value   = null
  bookingSuccess.value = false
  if (!isLoggedIn.value)  { router.push(loginUrl.value); return }
  if (!reservationForm.startDate || !reservationForm.endDate) {
    bookingError.value = 'Veuillez sélectionner une période.'; return
  }
  if (bookingNights.value < 1) {
    bookingError.value = 'La date de fin doit être après la date de début.'; return
  }
  bookingSubmitting.value = true
  try {
    await createReservation({
      propertyId: String(property.value.id),
      startDate:  reservationForm.startDate,
      endDate:    reservationForm.endDate,
    })
    bookingSuccess.value = true
    reservationForm.startDate = ''
    reservationForm.endDate   = ''
  } catch (err) {
    bookingError.value = err instanceof Error ? err.message : 'Une erreur est survenue.'
  } finally {
    bookingSubmitting.value = false
  }
}

const formatPrice = (p: number) => `${Number(p).toLocaleString('fr-FR')} FCFA`

onMounted(async () => {
  try {
    property.value = await getProperty(String(route.params.id))
  } catch {
    property.value = null
  } finally {
    loading.value = false
  }
  startSlideshow()
})

onUnmounted(stopSlideshow)
</script>

<template>
  <div v-if="loading" class="flex min-h-[60vh] items-center justify-center">
    <div class="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
  </div>

  <div v-else-if="!property" class="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
    <h1 class="text-3xl font-black text-slate-950">Bien non trouvé</h1>
    <p class="mt-3 text-slate-500">Ce bien n'existe pas ou n'est plus disponible.</p>
    <RouterLink to="/biens"
      class="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors">
      <ArrowLeft class="h-4 w-4" /> Retour aux biens
    </RouterLink>
  </div>

  <div v-else class="bg-slate-50 pb-16">

    <div class="relative h-[70vh] min-h-[500px] overflow-hidden bg-slate-950">
      <transition name="fade-slide" mode="out-in">
        <img :key="activeImageIndex" :src="mainImage" :alt="property.title" class="h-full w-full object-cover" />
      </transition>

      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

      <div class="absolute left-4 top-4 sm:left-8 sm:top-8">
        <RouterLink to="/biens"
          class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/25 transition-colors">
          <ArrowLeft class="h-4 w-4" /> Retour
        </RouterLink>
      </div>

      <button @click="isFavorite = !isFavorite"
        class="absolute right-4 top-4 sm:right-8 sm:top-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors hover:bg-white/25">
        <Heart class="h-5 w-5 transition-colors" :class="isFavorite ? 'fill-red-400 text-red-400' : 'text-white'" />
      </button>

      <div class="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
        <button @click="goPrev" class="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors">
          <ChevronLeft class="h-6 w-6" />
        </button>
        <button @click="goNext" class="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors">
          <ChevronRight class="h-6 w-6" />
        </button>
      </div>

      <div class="absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-2">
        <button v-for="(_, i) in galleryImages" :key="i"
          @click="() => { stopSlideshow(); activeImageIndex = i }"
          class="h-1.5 rounded-full transition-all"
          :class="activeImageIndex === i ? 'w-8 bg-white' : 'w-2 bg-white/40'" />
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur">
                {{ property.type || 'Villa' }}
              </span>
              <span class="rounded-full px-3 py-1 text-xs font-bold" :class="statusClasses[property.status]">
                {{ statusLabels[property.status] || property.status }}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                <ShieldCheck class="h-3.5 w-3.5 text-emerald-300" /> Annonce vérifiée
              </span>
            </div>
            <h1 class="text-3xl font-black text-white sm:text-4xl lg:text-5xl">{{ property.title }}</h1>
            <p class="mt-2 flex items-center gap-1.5 text-white/75">
              <MapPin class="h-4 w-4 flex-shrink-0" />{{ property.address }}, {{ property.city }}
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 px-5 py-3 text-right backdrop-blur-md border border-white/10">
            <p class="text-xs uppercase tracking-widest text-white/60">Prix par nuit</p>
            <p class="mt-0.5 text-3xl font-black text-white">{{ formatPrice(property.pricePerNight || 0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-5 gap-2 rounded-2xl overflow-hidden shadow-xl">
        <button v-for="(img, i) in galleryImages" :key="img"
          @click="() => { stopSlideshow(); activeImageIndex = i }"
          class="relative overflow-hidden transition-all"
          :class="activeImageIndex === i ? 'ring-4 ring-sky-500 ring-offset-2' : 'opacity-70 hover:opacity-100'">
          <img :src="img" class="h-20 w-full object-cover" :alt="`Vue ${i + 1}`" />
          <div v-if="activeImageIndex === i" class="absolute inset-0 bg-sky-500/20" />
        </button>
      </div>
    </div>

    <div class="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-[1fr_400px]">

        <div class="space-y-8">

          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div v-for="stat in [
              { label: 'Surface', value: `${property.surface ?? 0} m²`, icon: Maximize },
              { label: 'Chambres', value: property.bedrooms ?? 0, icon: BedDouble },
              { label: 'Salles de bain', value: property.bathrooms ?? 0, icon: Bath },
              { label: 'Capacité', value: `${property.capacity ?? 0} pers.`, icon: Users },
            ]" :key="stat.label"
              class="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm border border-slate-100">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                <component :is="stat.icon" class="h-5 w-5 text-sky-600" />
              </div>
              <p class="text-xl font-black text-slate-950">{{ stat.value }}</p>
              <p class="text-xs text-slate-500">{{ stat.label }}</p>
            </div>
          </div>

          <div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 class="text-xl font-black text-slate-950 mb-4">Description</h2>
            <p class="leading-8 text-slate-600">{{ property.description }}</p>
          </div>

          <div v-if="property.options?.length" class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 class="text-xl font-black text-slate-950 mb-2">Équipements & Options</h2>
            <p class="text-sm text-slate-500 mb-5">Ce bien dispose des équipements suivants</p>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div v-for="opt in property.options" :key="opt.id"
                class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-sky-200 hover:bg-sky-50 transition-colors">
                <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-sky-100">
                  <component :is="getOptionIcon(opt.name)" class="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <p class="font-semibold text-slate-950 text-sm">{{ opt.name }}</p>
                  <p class="text-xs text-slate-400">Inclus</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-black text-slate-950">Avis clients</h2>
              <div class="flex items-center gap-1">
                <Star v-for="i in 5" :key="i" class="h-4 w-4 fill-amber-400 text-amber-400" />
                <span class="ml-1 text-sm font-bold text-slate-700">4.9</span>
              </div>
            </div>
            <div class="space-y-4">
              <div v-for="avis in [
                { nom: 'Kouadio M.', note: 5, texte: 'Séjour exceptionnel ! La villa est exactement comme sur les photos, très propre et bien équipée.' },
                { nom: 'Aminata D.', note: 5, texte: 'Agent très réactif, je recommande vivement cette propriété pour des vacances en famille.' },
              ]" :key="avis.nom" class="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-semibold text-slate-950">{{ avis.nom }}</p>
                  <div class="flex gap-0.5">
                    <Star v-for="i in avis.note" :key="i" class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <p class="text-sm text-slate-600">{{ avis.texte }}</p>
              </div>
            </div>
          </div>

        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-6 space-y-4">

            <div class="overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100">
              <div class="bg-slate-950 p-5 text-white">
                <p class="text-sm text-white/60">Prix par nuit</p>
                <p class="mt-1 text-4xl font-black">{{ formatPrice(property.pricePerNight || 0) }}</p>
                <p class="mt-1 text-sm text-white/60">Charges comprises · Réservation sécurisée</p>
              </div>

              <div class="p-5 space-y-4">

                <div v-if="!isLoggedIn" class="space-y-3">
                  <div class="rounded-xl bg-amber-50 border border-amber-200 p-4">
                    <p class="font-semibold text-amber-900 text-sm">Connexion requise</p>
                    <p class="mt-1 text-xs text-amber-700">Vous devez avoir un compte pour réserver ce bien.</p>
                  </div>
                  <RouterLink :to="loginUrl"
                    class="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3.5 font-bold text-white hover:bg-sky-600 transition-colors">
                    <LogIn class="h-5 w-5" />Se connecter pour réserver
                  </RouterLink>
                  <RouterLink :to="registerUrl"
                    class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-sm">
                    <UserPlus class="h-4 w-4" />Créer un compte gratuitement
                  </RouterLink>
                </div>

                <template v-else>
                  <div v-if="property.status !== 'disponible'" class="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
                    <p class="font-semibold text-red-700">Ce bien n'est pas disponible</p>
                  </div>

                  <template v-else>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Arrivée</label>
                        <input v-model="reservationForm.startDate" type="date" :min="minDate"
                          class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20" />
                      </div>
                      <div>
                        <label class="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Départ</label>
                        <input v-model="reservationForm.endDate" type="date" :min="reservationForm.startDate || minDate"
                          class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20" />
                      </div>
                    </div>

                    <div v-if="bookingNights > 0" class="rounded-xl bg-slate-50 p-4 space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-slate-500">{{ formatPrice(property.pricePerNight || 0) }} × {{ bookingNights }} nuit(s)</span>
                        <span class="font-semibold">{{ formatPrice(bookingTotal) }}</span>
                      </div>
                      <div class="flex justify-between border-t border-slate-200 pt-2 font-black text-base">
                        <span>Total</span>
                        <span class="text-sky-600">{{ formatPrice(bookingTotal) }}</span>
                      </div>
                    </div>

                    <div v-if="bookingError" class="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{{ bookingError }}</div>
                    <div v-if="bookingSuccess" class="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 font-semibold">
                      ✅ Demande envoyée ! Un agent confirmera sous 48h.
                    </div>

                    <button @click="submitBooking" :disabled="bookingSubmitting || bookingNights < 1"
                      class="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-4 font-bold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors text-lg shadow-lg shadow-sky-200">
                      <span v-if="bookingSubmitting" class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <CalendarDays v-else class="h-5 w-5" />
                      {{ bookingSubmitting ? 'Envoi en cours...' : 'Réserver maintenant' }}
                    </button>
                  </template>
                </template>

              </div>
            </div>

            <div class="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 space-y-3 text-sm">
              <div class="flex justify-between"><span class="text-slate-500">Ville</span><span class="font-semibold">{{ property.city }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Type</span><span class="font-semibold capitalize">{{ property.type || 'Villa' }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Référence</span><span class="font-mono">#{{ property.id }}</span></div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">Disponibilité</span>
                <span class="rounded-full px-2.5 py-1 text-xs font-bold" :class="statusClasses[property.status]">{{ statusLabels[property.status] }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-slide-enter-from { opacity: 0; transform: scale(1.03); }
.fade-slide-leave-to   { opacity: 0; transform: scale(0.97); }
</style>