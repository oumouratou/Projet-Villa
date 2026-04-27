<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock,
  Car,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Maximize,
  ShieldCheck,
  Tv,
  Users,
  Waves,
  Wind,
  UtensilsCrossed,
  Wifi,
  XCircle,
} from 'lucide-vue-next'
import { getDetail, getList } from '@/lib/api'

const route = useRoute()
const property = ref<any | null>(null)
const activeImageIndex = ref(0)

const fallbackGallery = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1400&h=1000&fit=crop',
]

const iconMap: Record<string, any> = { wifi: Wifi, car: Car, waves: Waves, wind: Wind, tv: Tv, utensils: UtensilsCrossed }
const statusLabels: Record<string, string> = { disponible: 'Disponible', reserve: 'Réservé', maintenance: 'Maintenance' }
const statusClasses: Record<string, string> = {
  disponible: 'inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700',
  reserve: 'inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700',
  maintenance: 'inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700',
}
const reservationLabels: Record<string, string> = { confirmee: 'Confirmée', en_attente: 'En attente', refusee: 'Refusée', annulee: 'Annulée' }
const reservationIcons: Record<string, any> = { confirmee: CheckCircle2, en_attente: Clock, refusee: XCircle }
const reservationStatusClasses: Record<string, string> = {
  confirmee: 'inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700',
  en_attente: 'inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700',
  refusee: 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700',
  annulee: 'inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700',
}

const propertyReservations = ref<any[]>([])
const propertyOptions = computed(() => property.value?.options ?? [])
const galleryImages = computed<string[]>(() => {
  const baseImages = (property.value?.images && property.value.images.length > 0 ? property.value.images : fallbackGallery) as string[]
  const uniqueImages = [...new Set(baseImages)]

  while (uniqueImages.length < 5) {
    uniqueImages.push(fallbackGallery[uniqueImages.length % fallbackGallery.length])
  }

  return uniqueImages
})

const mainImage = computed(() => galleryImages.value[activeImageIndex.value % galleryImages.value.length])

const mainStats = computed(() => [
  { label: 'Surface', value: `${property.value?.surface ?? 0} m²`, icon: Maximize },
  { label: 'Chambres', value: property.value?.bedrooms ?? 0, icon: BedDouble },
  { label: 'Salles de bain', value: property.value?.bathrooms ?? 0, icon: Bath },
  { label: 'Capacité', value: `${property.value?.capacity ?? 0} pers.`, icon: Users },
])

const roomGallery = computed(() => [
  { label: 'Salon lumineux', image: galleryImages.value[1] ?? galleryImages.value[0] },
  { label: 'Chambre principale', image: galleryImages.value[2] ?? galleryImages.value[0] },
  { label: 'Piscine et extérieur', image: galleryImages.value[3] ?? galleryImages.value[0] },
])

const sideStats = computed(() => {
  const confirmed = propertyReservations.value.filter(reservation => reservation.status === 'confirmee')
  const totalRevenue = confirmed.reduce((sum, reservation) => sum + reservation.totalPrice, 0)

  return [
    { label: 'Total réservations', value: propertyReservations.value.length },
    { label: 'Confirmées', value: confirmed.length, color: 'text-emerald-600' },
    { label: 'En attente', value: propertyReservations.value.filter(reservation => reservation.status === 'en_attente').length, color: 'text-amber-600' },
    { label: 'Revenus totaux', value: formatPrice(totalRevenue) },
  ]
})

const getClientName = (client: any) => client ? `${client.first_name || client.firstName || ''} ${client.last_name || client.lastName || ''}`.trim() : 'Client inconnu'

const formatDate = (date: Date) => date.toLocaleDateString('fr-FR')
const formatPrice = (price: number) => `${price.toLocaleString()} FCFA`

const goPrev = () => {
  activeImageIndex.value = (activeImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

const goNext = () => {
  activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length
}

onMounted(async () => {
  try {
    property.value = await getDetail('/properties', String(route.params.id))
  } catch {
    property.value = null
  }

  try {
    const reservations = await getList('/reservations')
    propertyReservations.value = reservations.filter((reservation: any) => String(reservation.property_id || reservation.propertyId) === String(route.params.id))
  } catch {
    propertyReservations.value = []
  }
})
</script>

<template>
  <div v-if="!property" class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
    <h1 class="text-3xl font-black text-slate-950">Bien non trouvé</h1>
    <p class="mt-3 text-slate-600">Le bien demandé n’existe pas ou n’est plus disponible.</p>
    <RouterLink to="/biens" class="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
      <ArrowLeft class="h-4 w-4" />
      Retour à la liste
    </RouterLink>
  </div>

  <div v-else class="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
    <section class="glass-card rounded-[2rem] p-5 shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="flex items-start gap-4">
          <RouterLink to="/biens" class="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100">
            <ArrowLeft class="h-5 w-5" />
          </RouterLink>
          <div>
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-3xl font-black tracking-tight text-slate-950">{{ property.title }}</h1>
              <span :class="statusClasses[property.status]">{{ statusLabels[property.status] }}</span>
            </div>
            <div class="mt-2 flex items-center gap-2 text-slate-600">
              <MapPin class="h-4 w-4" />
              <span>{{ property.address }}, {{ property.city }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 self-start rounded-full bg-slate-950 px-4 py-2 text-white">
          <ShieldCheck class="h-4 w-4 text-emerald-300" />
          <span class="text-sm font-semibold">Annonce vérifiée</span>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-4">
        <div class="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-[0_28px_70px_rgba(15,23,42,0.2)]">
          <img :src="mainImage" :alt="property.title" class="h-[30rem] w-full object-cover opacity-95 transition-all duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
          <div class="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
            <div class="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">Galerie du bien</div>
            <div class="flex items-center gap-2">
              <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25" @click="goPrev">
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25" @click="goNext">
                <ChevronRight class="h-5 w-5" />
              </button>
            </div>
          </div>
          <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{{ property.type }}</p>
              <p class="mt-2 text-lg font-bold text-white">{{ formatPrice(property.pricePerNight) }} / nuit</p>
            </div>
            <button type="button" class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <Heart class="h-4 w-4" />
              Favori
            </button>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button
            v-for="(image, index) in galleryImages"
            :key="image"
            type="button"
            :class="[
              'overflow-hidden rounded-[1.25rem] border transition-all',
              activeImageIndex === index ? 'border-sky-500 ring-4 ring-sky-500/10' : 'border-slate-200 hover:border-slate-300',
            ]"
            @click="activeImageIndex = index"
          >
            <img :src="image" alt="Aperçu du bien" class="h-28 w-full object-cover" />
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div class="glass-card rounded-[2rem] p-6">
          <h3 class="text-lg font-bold text-slate-950">Le bien en un coup d’œil</h3>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div v-for="stat in mainStats" :key="stat.label" class="rounded-2xl bg-slate-50 p-4">
              <div class="flex items-center gap-3">
                <component :is="stat.icon" class="h-5 w-5 text-sky-600" />
                <div>
                  <p class="text-xs text-slate-500">{{ stat.label }}</p>
                  <p class="font-bold text-slate-950">{{ stat.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <p class="text-sm text-white/65">Prix / nuit</p>
            <p class="mt-1 text-4xl font-black tracking-tight">{{ formatPrice(property.pricePerNight) }}</p>
            <p class="mt-2 text-sm text-white/70">Réservation sécurisée et accompagnée.</p>
          </div>
        </div>

        <div class="glass-card rounded-[2rem] p-6">
          <h3 class="text-lg font-bold text-slate-950">Ce que vous voyez ici</h3>
          <div class="mt-4 grid gap-4">
            <div v-for="room in roomGallery" :key="room.label" class="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
              <img :src="room.image" :alt="room.label" class="h-36 w-full object-cover" />
              <div class="p-4">
                <p class="font-semibold text-slate-950">{{ room.label }}</p>
                <p class="mt-1 text-sm text-slate-600">Un visuel détaillé pour mieux se projeter avant la visite.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-6">
        <article class="glass-card rounded-[2rem] p-6">
          <h3 class="text-lg font-bold text-slate-950">Description</h3>
          <p class="mt-4 leading-8 text-slate-600">{{ property.description }}</p>
        </article>

        <article class="glass-card rounded-[2rem] p-6">
          <h3 class="text-lg font-bold text-slate-950">Équipements et options</h3>
          <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="option in propertyOptions" :key="option.id" class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <component :is="iconMap[option.icon] || Wifi" class="h-5 w-5 text-sky-600" />
              <div>
                <p class="font-semibold text-slate-950">{{ option.name }}</p>
                <p class="text-xs text-slate-500">{{ option.description }}</p>
              </div>
            </div>
          </div>
        </article>

        <article class="glass-card rounded-[2rem] overflow-hidden">
          <div class="border-b border-slate-200 p-6">
            <h3 class="flex items-center gap-2 text-lg font-bold text-slate-950">
              <CalendarDays class="h-5 w-5 text-sky-600" />
              Historique des réservations
            </h3>
            <p class="mt-1 text-sm text-slate-500">{{ propertyReservations.length }} réservation(s) pour ce bien</p>
          </div>
          <div class="p-6">
            <div v-if="propertyReservations.length === 0" class="py-8 text-center text-slate-400">
              Aucune réservation pour ce bien
            </div>
            <div v-else class="space-y-3">
              <div v-for="reservation in propertyReservations" :key="reservation.id" class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p class="font-bold text-slate-950">{{ getClientName(reservation.clientId) }}</p>
                  <p class="text-sm text-slate-500">{{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate) }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="font-bold text-slate-950">{{ formatPrice(reservation.totalPrice) }}</span>
                  <span :class="reservationStatusClasses[reservation.status]">
                    <component :is="reservationIcons[reservation.status]" class="mr-1.5 h-3.5 w-3.5" />
                    {{ reservationLabels[reservation.status] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="space-y-6">
        <article class="glass-card rounded-[2rem] p-6">
          <h3 class="text-lg font-bold text-slate-950">Statistiques</h3>
          <div class="mt-4 space-y-4">
            <div v-for="stat in sideStats" :key="stat.label" class="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
              <span class="text-slate-500">{{ stat.label }}</span>
              <span class="font-bold" :class="stat.color || 'text-slate-950'">{{ stat.value }}</span>
            </div>
          </div>
        </article>

        <article class="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
          <p class="text-sm text-white/65">Besoin d’un conseil ?</p>
          <h3 class="mt-2 text-2xl font-black">Une équipe vous accompagne pour réserver ce bien.</h3>
          <p class="mt-4 text-sm leading-7 text-white/75">Les photos, la disponibilité et les informations utiles sont centralisées pour faciliter la décision.</p>
        </article>
      </div>
    </section>
  </div>
</template>
