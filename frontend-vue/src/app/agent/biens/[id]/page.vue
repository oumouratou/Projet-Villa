<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Edit, Trash2, MapPin, Bed, Bath, Users, Maximize, Wifi, Car, Waves, Wind, Tv, UtensilsCrossed, CalendarDays, CheckCircle2, XCircle, Clock } from 'lucide-vue-next'
import { getDetail, getList } from '@/lib/api'

const route = useRoute()
const property = ref<any | null>(null)
const propertyReservations = ref<any[]>([])
const propertyOptions = computed(() => property.value?.options ?? [])

const iconMap: Record<string, any> = { wifi: Wifi, car: Car, waves: Waves, wind: Wind, tv: Tv, utensils: UtensilsCrossed }
const statusLabels: Record<string, string> = { disponible: 'Disponible', reserve: 'Réservé', maintenance: 'Maintenance' }
const statusClasses: Record<string, string> = { disponible: 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700', reserve: 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700', maintenance: 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700' }
const reservationLabels: Record<string, string> = { confirmee: 'Confirmée', en_attente: 'En attente', refusee: 'Refusée' }
const reservationIcons: Record<string, any> = { confirmee: CheckCircle2, en_attente: Clock, refusee: XCircle }
const reservationStatusClasses: Record<string, string> = { confirmee: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700', en_attente: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700', refusee: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700' }

const mainStats = computed(() => [
  { label: 'Surface', value: `${property.value?.surface ?? 0} m²`, icon: Maximize },
  { label: 'Chambres', value: property.value?.bedrooms ?? 0, icon: Bed },
  { label: 'Salles de bain', value: property.value?.bathrooms ?? 0, icon: Bath },
  { label: 'Capacité', value: `${property.value?.capacity ?? 0} pers.`, icon: Users },
])

const sideStats = computed(() => {
  const confirmed = propertyReservations.value.filter((reservation) => reservation.status === 'confirmee')
  const totalRevenue = confirmed.reduce((sum, reservation) => sum + reservation.totalPrice, 0)

  return [
    { label: 'Total réservations', value: propertyReservations.value.length },
    { label: 'Confirmées', value: confirmed.length, color: 'text-green-600' },
    { label: 'En attente', value: propertyReservations.value.filter((reservation) => reservation.status === 'en_attente').length, color: 'text-amber-600' },
    { label: 'Revenus totaux', value: formatPrice(totalRevenue) },
  ]
})

const getClientName = (clientId: string) => {
  const client = propertyReservations.value.find((item) => item.client?.id === clientId)?.client
  return client ? `${client.first_name || client.firstName || ''} ${client.last_name || client.lastName || ''}`.trim() : 'Client inconnu'
}

const formatDate = (date: Date) => date.toLocaleDateString('fr-FR')
const formatPrice = (price: number) => `${price.toLocaleString()} FCFA`

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
  <div v-if="!property" class="flex flex-col items-center justify-center py-12">
    <h1 class="text-2xl font-bold text-slate-900">Bien non trouvé</h1>
    <RouterLink to="/agent/biens" class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white">Retour à la liste</RouterLink>
  </div>

  <div v-else class="space-y-6 p-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <RouterLink to="/agent/biens" class="rounded-full border border-slate-200 p-2 transition-colors hover:bg-slate-100">
          <ArrowLeft class="h-5 w-5 text-slate-600" />
        </RouterLink>
        <div>
          <h1 class="text-3xl font-bold text-slate-900">{{ property.title }}</h1>
          <div class="mt-1 flex items-center gap-2 text-slate-500">
            <MapPin class="h-4 w-4" />
            <span>{{ property.address }}, {{ property.city }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <RouterLink :to="`/agent/biens/${property.id}/modifier`" class="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 transition-colors hover:bg-slate-50">
          <Edit class="mr-2 h-4 w-4" /> Modifier
        </RouterLink>
        <button class="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
          <Trash2 class="mr-2 h-4 w-4" /> Supprimer
        </button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="aspect-video overflow-hidden rounded-xl bg-slate-100 md:col-span-2">
        <img :src="property.images[0]" :alt="property.title" class="h-full w-full object-cover" />
      </div>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-1">
        <div v-for="(image, index) in property.images.slice(1, 3)" :key="index" class="aspect-video overflow-hidden rounded-xl bg-slate-100">
          <img :src="image" alt="" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 p-6">
            <h3 class="text-lg font-bold text-slate-900">Informations</h3>
            <span :class="statusClasses[property.status]">{{ statusLabels[property.status] }}</span>
          </div>
          <div class="space-y-6 p-6">
            <div class="grid gap-4 sm:grid-cols-4">
              <div v-for="stat in mainStats" :key="stat.label" class="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <component :is="stat.icon" class="h-5 w-5 text-blue-600" />
                <div>
                  <p class="text-xs text-slate-500">{{ stat.label }}</p>
                  <p class="font-bold text-slate-900">{{ stat.value }}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="mb-2 font-bold text-slate-900">Description</h4>
              <p class="leading-relaxed text-slate-600">{{ property.description }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg font-bold text-slate-900">Équipements et options</h3>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div v-for="option in propertyOptions" :key="option.id" class="flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-3">
              <component :is="iconMap[option.icon] || Wifi" class="h-5 w-5 text-blue-600" />
              <span class="text-sm font-medium text-slate-700">{{ option.name }}</span>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-100 p-6">
            <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
              <CalendarDays class="h-5 w-5 text-blue-600" />
              Historique des réservations
            </h3>
            <p class="text-sm text-slate-500">{{ propertyReservations.length }} réservation(s) pour ce bien</p>
          </div>
          <div class="p-6">
            <div v-if="propertyReservations.length === 0" class="py-8 text-center text-slate-400">Aucune réservation pour ce bien</div>
            <div v-else class="space-y-3">
              <div v-for="reservation in propertyReservations" :key="reservation.id" class="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-colors hover:bg-slate-50">
                <div>
                  <p class="font-bold text-slate-900">{{ getClientName(reservation.clientId) }}</p>
                  <p class="text-sm text-slate-500">{{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate) }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="font-bold text-slate-900">{{ formatPrice(reservation.totalPrice) }}</span>
                  <span :class="reservationStatusClasses[reservation.status]">
                    <component :is="reservationIcons[reservation.status]" class="mr-1.5 h-3.5 w-3.5" />
                    {{ reservationLabels[reservation.status] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h3 class="mb-2 text-sm font-medium uppercase tracking-wider text-slate-500">Tarification</h3>
          <p class="text-4xl font-black text-blue-600">{{ formatPrice(property.pricePerNight) }}</p>
          <p class="mt-1 text-sm text-slate-400">FCFA / nuit</p>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg font-bold text-slate-900">Statistiques</h3>
          <div class="space-y-4">
            <div v-for="stat in sideStats" :key="stat.label" class="flex items-center justify-between border-b border-slate-50 py-2 last:border-0">
              <span class="text-slate-500">{{ stat.label }}</span>
              <span class="font-bold" :class="stat.color || 'text-slate-900'">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>