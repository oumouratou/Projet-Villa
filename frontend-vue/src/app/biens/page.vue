<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-vue-next'
import PublicHeader from '@/components/PublicHeader.vue'
import PublicFooter from '@/components/PublicFooter.vue'
import PropertyCard from '@/components/PropertyCard.vue'
import { getList } from '@/lib/api'

const route = useRoute()
const router = useRouter()
const priceLimit = 500000

const searchCity = ref('')
const priceRange = ref<[number, number]>([0, priceLimit])
const selectedOptions = ref<string[]>([])
const showFilters = ref(false)
const sortBy = ref<'price-asc' | 'price-desc' | 'newest'>('newest')
const properties = ref<any[]>([])
const options = ref<any[]>([])

const filteredProperties = computed(() => {
  let result = properties.value.filter((property) => property.status === 'disponible')

  if (searchCity.value) {
    const term = searchCity.value.toLowerCase()
    result = result.filter((property) => {
      const postalCode = property.postal_code || property.postalCode || ''
      return property.city.toLowerCase().includes(term)
        || property.address.toLowerCase().includes(term)
        || postalCode.includes(searchCity.value)
        || property.title.toLowerCase().includes(term)
    })
  }

  result = result.filter((property) => property.price >= priceRange.value[0] && property.price <= priceRange.value[1])

  if (selectedOptions.value.length > 0) {
    result = result.filter((property) => selectedOptions.value.every((optionId) => (property.options || []).some((option: any) => option.id === optionId)))
  }

  const sorted = [...result]
  switch (sortBy.value) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    default:
      sorted.sort((a, b) => new Date(b.created_at || b.createdAt || 0).getTime() - new Date(a.created_at || a.createdAt || 0).getTime())
  }

  return sorted
})

const totalResultLabel = computed(() => `${filteredProperties.value.length} bien${filteredProperties.value.length > 1 ? 's' : ''} disponible${filteredProperties.value.length > 1 ? 's' : ''}`)

const applyRouteFilters = () => {
  const city = typeof route.query.city === 'string' ? route.query.city : ''
  const budget = typeof route.query.budget === 'string' ? Number(route.query.budget) : NaN

  searchCity.value = city
  priceRange.value = [0, Number.isFinite(budget) && budget > 0 ? budget : priceLimit]
}

onMounted(async () => {
  applyRouteFilters()
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

watch(() => route.query, () => applyRouteFilters())

const toggleOption = (id: string) => {
  const index = selectedOptions.value.indexOf(id)
  if (index > -1) selectedOptions.value.splice(index, 1)
  else selectedOptions.value.push(id)
}

const clearFilters = () => {
  searchCity.value = ''
  priceRange.value = [0, priceLimit]
  selectedOptions.value = []
  sortBy.value = 'newest'
  router.replace({ query: {} })
}

const updateMinPrice = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)
  priceRange.value = [value, priceRange.value[1]]
}

const updateMaxPrice = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)
  priceRange.value = [priceRange.value[0], value]
}

const submitSearch = () => {
  router.replace({
    path: '/biens',
    query: {
      ...(searchCity.value ? { city: searchCity.value } : {}),
      ...(priceRange.value[1] < priceLimit ? { budget: String(priceRange.value[1]) } : {}),
    },
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <PublicHeader />

    <main class="flex-1">
      <section class="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.24),transparent_28%),linear-gradient(120deg,rgba(3,7,18,0.94),rgba(15,23,42,0.88),rgba(30,41,59,0.92))]"></div>
        </div>
        <div class="relative mx-auto max-w-7xl">
          <div class="max-w-3xl">
            <p class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/75 backdrop-blur">
              <Sparkles class="h-4 w-4 text-amber-300" />
              Locations de prestige à Abidjan & Assinie
            </p>
            <h1 class="text-4xl font-black leading-tight sm:text-5xl">
              Villas et appartements <span class="text-sky-500">de haut standing.</span>
            </h1>
            <p class="mt-5 max-w-2xl text-lg text-white/75">
              Explorez notre sélection exclusive et trouvez le bien idéal avec une recherche fluide et intuitive.
            </p>
          </div>
        </div>
      </section>

      <section class="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-[1.75rem] p-6 shadow-2xl border border-slate-100">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-950">Catalogue immobilier</h2>
              <p class="text-slate-500 text-sm mt-1">{{ totalResultLabel }}</p>
            </div>
            <div class="flex items-center gap-3 text-sm font-medium text-slate-500">
              <SlidersHorizontal class="h-4 w-4" />
              Filtres et tri dynamique
            </div>
          </div>

          <div class="grid gap-4 lg:grid-cols-[1fr_180px_auto]">
            <div class="relative">
              <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                v-model="searchCity"
                type="text"
                placeholder="Ex: Cocody, Riviera, Assinie..."
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-4 text-slate-900 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all"
                @keyup.enter="submitSearch"
              />
            </div>

            <select
              v-model="sortBy"
              class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none focus:ring-4 focus:ring-sky-500/10"
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>

            <button
              class="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold transition-all"
              :class="showFilters ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              @click="showFilters = !showFilters"
            >
              <SlidersHorizontal class="h-5 w-5" />
              Filtres
              <span v-if="selectedOptions.length > 0" class="rounded-full bg-sky-500 text-white px-2 py-0.5 text-[10px]">
                {{ selectedOptions.length }}
              </span>
            </button>
          </div>

          <div v-if="showFilters" class="mt-8 border-t border-slate-100 pt-8">
            <div class="grid gap-12 lg:grid-cols-2">
              <div>
                <label class="mb-4 block text-sm font-bold text-slate-900 uppercase">
                  Budget (FCFA) : {{ priceRange[0].toLocaleString() }} - {{ priceRange[1].toLocaleString() }}
                </label>
                <div class="flex gap-6">
                  <input :value="priceRange[0]" type="range" min="0" :max="priceLimit" step="5000" class="flex-1 accent-sky-500" @input="updateMinPrice" />
                  <input :value="priceRange[1]" type="range" min="0" :max="priceLimit" step="5000" class="flex-1 accent-sky-500" @input="updateMaxPrice" />
                </div>
              </div>

              <div>
                <label class="mb-4 block text-sm font-bold text-slate-900 uppercase">Équipements</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="option in options"
                    :key="option.id"
                    :class="[
                      'rounded-xl px-4 py-2 text-sm font-bold transition-all',
                      selectedOptions.includes(option.id) ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' : 'bg-slate-100 text-slate-600'
                    ]"
                    @click="toggleOption(option.id)"
                  >
                    {{ option.name }}
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-[1.75rem]">
              <button class="text-sm font-bold text-slate-400 hover:text-red-500 flex items-center gap-2" @click="clearFilters">
                <X class="h-4 w-4" /> Effacer
              </button>
              <button class="bg-sky-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-colors" @click="submitSearch">
                Appliquer
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div v-if="filteredProperties.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <PropertyCard
            v-for="property in filteredProperties"
            :key="property.id"
            :property="property"
          />
        </div>

        <div v-else class="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
          <Search class="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 class="text-xl font-bold text-slate-950">Aucun bien ne correspond à vos critères</h3>
          <p class="text-slate-500 mt-2">Réduisez vos filtres ou élargissez votre zone de recherche.</p>
          <button class="mt-8 rounded-full bg-slate-950 px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105" @click="clearFilters">
            Réinitialiser tout
          </button>
        </div>
      </section>
    </main>

    <PublicFooter />
  </div>
</template>