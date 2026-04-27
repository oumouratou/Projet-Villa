<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Maximize, X, Calendar } from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'
import { getList } from '@/lib/api'

const searchCity = ref('')
const priceMin = ref('')
const priceMax = ref('')
const surfaceMin = ref('')
const selectedOptions = ref<string[]>([])
const showFilters = ref(false)
const properties = ref<any[]>([])
const options = ref<any[]>([])

const availableProperties = computed(() => properties.value.filter((p) => p.status === 'disponible'))

const filteredProperties = computed(() => {
  let result = [...availableProperties.value]
  if (searchCity.value) {
    result = result.filter((p) => {
      const postalCode = p.postal_code || p.postalCode || ''
      return p.city.toLowerCase().includes(searchCity.value.toLowerCase()) || postalCode.includes(searchCity.value)
    })
  }
  if (priceMin.value) result = result.filter((p) => p.price >= Number(priceMin.value))
  if (priceMax.value) result = result.filter((p) => p.price <= Number(priceMax.value))
  if (surfaceMin.value) result = result.filter((p) => p.surface >= Number(surfaceMin.value))
  if (selectedOptions.value.length > 0) {
    result = result.filter((p) => selectedOptions.value.every((optId) => (p.options || []).some((opt: any) => opt.id === optId)))
  }
  return result
})

const toggleOption = (optionId: string) => {
  selectedOptions.value = selectedOptions.value.includes(optionId)
    ? selectedOptions.value.filter((id) => id !== optionId)
    : [...selectedOptions.value, optionId]
}

const clearFilters = () => {
  searchCity.value = ''
  priceMin.value = ''
  priceMax.value = ''
  surfaceMin.value = ''
  selectedOptions.value = []
}

const hasActiveFilters = computed(() => !!searchCity.value || !!priceMin.value || !!priceMax.value || !!surfaceMin.value || selectedOptions.value.length > 0)

onMounted(async () => {
  try {
    properties.value = await getList('/properties')
  } catch {
    properties.value = []
  }

  try {
    options.value = await getList('/options')
  } catch {
    options.value = []
  }
})
</script>

<template>
  <DashboardHeader title="Rechercher un bien" subtitle="Trouvez votre prochain logement" />

  <main class="flex-1 overflow-auto p-6">
    <div class="mb-6 rounded-xl border border-border bg-card p-4">
      <div class="flex flex-col gap-4 lg:flex-row">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input v-model="searchCity" type="text" placeholder="Rechercher par ville ou code postal..." class="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4" />
        </div>
        <button @click="showFilters = !showFilters" class="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5" :class="showFilters || hasActiveFilters ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background text-foreground'">
          <SlidersHorizontal class="h-5 w-5" />
          Filtres
          <span v-if="hasActiveFilters" class="rounded bg-primary-foreground px-1.5 py-0.5 text-xs font-medium text-primary">actif</span>
        </button>
      </div>

      <div v-if="showFilters" class="mt-4 border-t border-border pt-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
          <input v-model="priceMin" type="number" placeholder="Prix minimum" class="rounded-lg border border-input bg-background px-4 py-2.5" />
          <input v-model="priceMax" type="number" placeholder="Prix maximum" class="rounded-lg border border-input bg-background px-4 py-2.5" />
          <input v-model="surfaceMin" type="number" placeholder="Surface minimum" class="rounded-lg border border-input bg-background px-4 py-2.5" />
        </div>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-foreground">Options</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="option in options" :key="option.id" type="button" @click="toggleOption(option.id)" class="rounded-lg px-3 py-1.5 text-sm" :class="selectedOptions.includes(option.id) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'">
              {{ option.name }}
            </button>
          </div>
        </div>

        <div class="flex justify-end">
          <button @click="clearFilters" class="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <X class="h-4 w-4" /> Effacer les filtres
          </button>
        </div>
      </div>
    </div>

    <p class="mb-4 text-muted-foreground">{{ filteredProperties.length }} bien{{ filteredProperties.length > 1 ? 's' : '' }} disponible{{ filteredProperties.length > 1 ? 's' : '' }}</p>

    <div v-if="filteredProperties.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="property in filteredProperties" :key="property.id" class="overflow-hidden rounded-xl border border-border bg-card">
        <div class="relative h-48">
          <img :src="property.images?.[0] || '/placeholder.svg'" :alt="property.title" class="h-full w-full object-cover" />
          <div class="absolute bottom-3 left-3 rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">{{ property.price.toLocaleString() }} FCFA/nuit</div>
        </div>
        <div class="p-4">
          <h3 class="mb-2 font-semibold text-foreground">{{ property.title }}</h3>
          <div class="mb-3 flex items-center gap-1 text-sm text-muted-foreground"><MapPin class="h-4 w-4" />{{ property.city }}</div>
          <div class="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-1"><Maximize class="h-4 w-4" />{{ property.surface }} m2</div>
            <div class="flex items-center gap-1"><Bed class="h-4 w-4" />{{ property.bedrooms ?? 0 }}</div>
            <div class="flex items-center gap-1"><Bath class="h-4 w-4" />{{ property.bathrooms ?? 0 }}</div>
          </div>
          <div class="flex gap-2">
            <RouterLink :to="`/biens/${property.id}`" class="flex-1 rounded-lg border border-input px-4 py-2 text-center text-sm font-medium text-foreground">Voir details</RouterLink>
            <RouterLink :to="`/client/reservations/nouvelle?bien=${property.id}`" class="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Calendar class="h-4 w-4" />Reserver</RouterLink>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="rounded-xl border border-border bg-card py-16 text-center">
      <Search class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h3 class="mb-2 text-lg font-semibold text-foreground">Aucun bien trouve</h3>
      <p class="mb-4 text-muted-foreground">Essayez de modifier vos criteres de recherche</p>
      <button @click="clearFilters" class="font-medium text-primary">Effacer tous les filtres</button>
    </div>
  </main>
</template>

