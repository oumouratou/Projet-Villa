<template>
  <div class="space-y-6 p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Gestion des biens</h1>
        <p class="text-slate-500 mt-1">
          {{ properties.length }} biens au total
        </p>
      </div>
      <router-link 
        to="/agent/biens/nouveau" 
        class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Plus class="mr-2 h-4 w-4" />
        Ajouter un bien
      </router-link>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un bien..."
            class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select 
          v-model="statusFilter"
          class="w-full sm:w-[180px] px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
        >
          <option value="all">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="reserve">Réservé</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <select 
          v-model="cityFilter"
          class="w-full sm:w-[180px] px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
        >
          <option value="all">Toutes les villes</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
    </div>

    <div v-if="filteredProperties.length > 0" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div 
        v-for="property in filteredProperties" 
        :key="property.id" 
        class="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
      >
        <div class="relative aspect-video">
          <img
            :src="property.images[0]"
            :alt="property.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span :class="['absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm', statusClasses[property.status]]">
            {{ statusLabels[property.status] }}
          </span>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold text-slate-900 line-clamp-1 flex-1">{{ property.title }}</h3>
            <div class="flex gap-1 ml-2">
              <router-link :to="`/agent/biens/${property.id}/modifier`" class="p-1.5 hover:bg-slate-100 rounded text-slate-500">
                <Edit class="h-4 w-4" />
              </router-link>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <MapPin class="h-4 w-4" />
              <span>{{ property.address }}, {{ property.city }}</span>
            </div>

            <div class="flex items-center gap-4 text-sm text-slate-600">
              <span class="flex items-center gap-1">
                <Building2 class="h-4 w-4 text-slate-400" />
                {{ property.bedrooms }} ch.
              </span>
              <span>{{ property.surface }} m²</span>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-slate-100">
              <span class="text-lg font-black text-blue-600">
                {{ property.pricePerNight.toLocaleString() }} FCFA
                <span class="text-xs font-normal text-slate-400">/nuit</span>
              </span>
              <router-link 
                :to="`/agent/biens/${property.id}`" 
                class="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Détails
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Building2 class="h-8 w-8 text-slate-300" />
      </div>
      <h3 class="text-lg font-bold text-slate-900">Aucun bien trouvé</h3>
      <p class="text-slate-500 mt-1 max-w-sm">
        Modifiez vos filtres ou ajoutez un nouveau bien immobilier pour commencer.
      </p>
      <router-link 
        to="/agent/biens/nouveau" 
        class="mt-6 flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Plus class="mr-2 h-4 w-4" />
        Ajouter un bien
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, MapPin, Building2, Edit } from 'lucide-vue-next'
import { getProperties } from '@/lib/api'

const searchTerm = ref('')
const statusFilter = ref('all')
const cityFilter = ref('all')
const properties = ref<any[]>([])

// --- DONNEES CALCULEES ---
const cities = computed(() => [...new Set(properties.value.map(p => p.city))])

const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesStatus = statusFilter.value === "all" || property.status === statusFilter.value
    const matchesCity = cityFilter.value === "all" || property.city === cityFilter.value
    
    return matchesSearch && matchesStatus && matchesCity
  })
})

onMounted(async () => {
  try {
    const backendProperties = await getProperties()
    if (backendProperties.length > 0) {
      properties.value = backendProperties
    }
  } catch {
    // Fallback mock local deja initialise
  }
})

// --- MAPPINGS DE STYLE ---
const statusLabels: any = {
  disponible: 'Disponible',
  reserve: 'Réservé',
  maintenance: 'Maintenance'
}

const statusClasses: any = {
  disponible: 'bg-green-100 text-green-700',
  reserve: 'bg-blue-100 text-blue-700',
  maintenance: 'bg-slate-100 text-slate-700'
}
</script>