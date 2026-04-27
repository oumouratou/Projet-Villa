<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center gap-4">
      <router-link to="/agent/biens" class="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200">
        <ArrowLeft class="h-5 w-5 text-slate-600" />
      </router-link>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Ajouter un bien</h1>
        <p class="text-slate-500 mt-1">
          Remplissez les informations du nouveau bien immobilier
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div class="p-6 border-b border-slate-100">
          <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 class="h-5 w-5 text-blue-600" />
            Informations générales
          </h3>
          <p class="text-sm text-slate-500">Détails principaux du bien</p>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Titre du bien *</label>
              <input 
                v-model="form.title"
                type="text" 
                placeholder="Ex: Villa moderne avec piscine"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Type de bien *</label>
              <select 
                v-model="form.type"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Sélectionner le type</option>
                <option v-for="t in propertyTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Description *</label>
            <textarea 
              v-model="form.description"
              rows="4"
              placeholder="Décrivez le bien en détail..."
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Adresse *</label>
              <input 
                v-model="form.address"
                type="text" 
                placeholder="Adresse complète"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Ville *</label>
              <select 
                v-model="form.city"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Sélectionner la ville</option>
                <option v-for="city in cities" :key="city.value" :value="city.value">{{ city.label }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-1">Caractéristiques</h3>
        <p class="text-sm text-slate-500 mb-4">Dimensions et capacité du bien</p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="field in characteristicsFields" :key="field.id" class="space-y-2">
            <label :for="field.id" class="text-sm font-medium text-slate-700">{{ field.label }} *</label>
            <input 
              :id="field.id"
              v-model.number="form[field.model]"
              type="number"
              :placeholder="field.placeholder"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-1">Tarification</h3>
        <p class="text-sm text-slate-500 mb-4">Prix et statut du bien</p>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Prix par nuit (FCFA) *</label>
            <input 
              v-model.number="form.pricePerNight"
              type="number" 
              placeholder="Ex: 50000"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Statut *</label>
            <select 
              v-model="form.status"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="disponible">Disponible</option>
              <option value="reserve">Réservé</option>
              <option value="maintenance">En maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-1">Options et équipements</h3>
        <p class="text-sm text-slate-500 mb-4">Sélectionnez les équipements disponibles</p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="option in mockOptions" :key="option.id" class="flex items-center space-x-3">
            <input 
              :id="option.id"
              type="checkbox"
              :value="option.id"
              v-model="form.selectedOptions"
              class="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label :for="option.id" class="text-sm font-medium text-slate-700 cursor-pointer">
              {{ option.name }}
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-1">Photos du bien</h3>
        <p class="text-sm text-slate-500 mb-4">Ajoutez des photos attractives (max 10)</p>
        
        <div class="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center bg-slate-50">
          <Upload class="h-10 w-10 mx-auto text-slate-400 mb-4" />
          <p class="text-sm text-slate-500 mb-2">Glissez-déposez vos images ici ou</p>
          <button type="button" @click="triggerFileInput" class="px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-sm font-medium">
            Parcourir les fichiers
          </button>
          <input type="file" ref="fileInput" class="hidden" multiple @change="handleFileChange" accept="image/*" />
          <p class="text-xs text-slate-400 mt-2">PNG, JPG jusqu'à 5MB</p>
        </div>

        <div v-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div v-for="(img, idx) in images" :key="idx" class="relative aspect-video rounded-lg overflow-hidden bg-slate-100 group">
            <img :src="img" class="w-full h-full object-cover" />
            <button 
              type="button"
              @click="removeImage(idx)"
              class="absolute top-2 right-2 h-6 w-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X class="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-4">
        <router-link to="/agent/biens" class="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium">
          Annuler
        </router-link>
        <button type="submit" class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          <Save class="h-4 w-4" />
          Enregistrer le bien
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ArrowLeft, Upload, X, Save, Building2 } from 'lucide-vue-next'
import { mockOptions } from '@/lib/mock-data'

// --- ETAT DU FORMULAIRE ---
const form = reactive({
  title: '',
  type: '',
  description: '',
  address: '',
  city: '',
  surface: null,
  bedrooms: null,
  bathrooms: null,
  capacity: null,
  pricePerNight: null,
  status: 'disponible',
  selectedOptions: [] as string[]
})

const images = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

// --- DONNEES DE REFERENCE ---
const propertyTypes = [
  { label: 'Villa', value: 'villa' },
  { label: 'Appartement', value: 'appartement' },
  { label: 'Studio', value: 'studio' },
  { label: 'Maison', value: 'maison' },
  { label: 'Duplex', value: 'duplex' }
]

const cities = [
  { label: 'Abidjan', value: 'abidjan' },
  { label: 'Bouaké', value: 'bouake' },
  { label: 'Yamoussoukro', value: 'yamoussoukro' },
  { label: 'San Pedro', value: 'san-pedro' }
]

const characteristicsFields = [
  { id: 'surface', label: 'Surface (m²)', model: 'surface', placeholder: 'Ex: 120' },
  { id: 'bedrooms', label: 'Chambres', model: 'bedrooms', placeholder: 'Ex: 3' },
  { id: 'bathrooms', label: 'Salles de bain', model: 'bathrooms', placeholder: 'Ex: 2' },
  { id: 'capacity', label: 'Capacité (pers.)', model: 'capacity', placeholder: 'Ex: 6' }
] as const

// --- LOGIQUE ---
const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return
  
  // Simulation de preview (URL.createObjectURL)
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) images.value.push(e.target.result as string)
    }
    reader.readAsDataURL(files[i])
  }
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const handleSubmit = () => {
  const payload = { ...form, images: images.value }
  console.log('Données envoyées :', payload)
  // Ici : appel API (axios.post...)
}
</script>