<template>
  <div v-if="isLoadingProperty" class="flex flex-col items-center justify-center py-12">
    <h1 class="text-2xl font-bold">Chargement du bien...</h1>
  </div>

  <div v-else-if="!property" class="flex flex-col items-center justify-center py-12">
    <h1 class="text-2xl font-bold">Bien non trouvé</h1>
    <router-link to="/agent/biens" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
      Retour à la liste
    </router-link>
  </div>

  <div v-else class="space-y-6 p-6">
    <div class="flex items-center gap-4">
      <router-link :to="`/agent/biens/${property.id}`" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
        <ArrowLeft class="h-5 w-5 text-slate-600" />
      </router-link>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Modifier le bien</h1>
        <p class="text-slate-500 mt-1">{{ property.title }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h3 class="font-bold text-slate-900 flex items-center gap-2">
            <Building2 class="h-5 w-5 text-blue-600" />
            Informations générales
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Titre du bien *</label>
              <input v-model="formData.title" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Type de bien *</label>
              <select v-model="formData.type" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="villa">Villa</option>
                <option value="appartement">Appartement</option>
                <option value="studio">Studio</option>
                <option value="maison">Maison</option>
                <option value="duplex">Duplex</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Description *</label>
            <textarea v-model="formData.description" rows="4" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Adresse *</label>
              <input v-model="formData.address" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700">Ville *</label>
              <select v-model="formData.city" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="abidjan">Abidjan</option>
                <option value="bouake">Bouaké</option>
                <option value="yamoussoukro">Yamoussoukro</option>
                <option value="san-pedro">San Pedro</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="font-bold text-slate-900 mb-4">Caractéristiques</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Surface (m²) *</label>
            <input v-model="formData.surface" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Chambres *</label>
            <input v-model="formData.bedrooms" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Salles de bain *</label>
            <input v-model="formData.bathrooms" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Capacité (pers.) *</label>
            <input v-model="formData.capacity" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="font-bold text-slate-900 mb-4">Tarification</h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Prix par nuit (FCFA) *</label>
            <input v-model="formData.pricePerNight" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Statut *</label>
            <select v-model="formData.status" class="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none">
              <option value="disponible">Disponible</option>
              <option value="reserve">Réservé</option>
              <option value="maintenance">En maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="font-bold text-slate-900 mb-4">Options et équipements</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="option in options" :key="option.id" class="flex items-center space-x-3">
            <input 
              type="checkbox" 
              :id="option.id" 
              :value="option.id" 
              v-model="formData.options"
              class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label :for="option.id" class="text-sm font-medium text-slate-700 cursor-pointer">
              {{ option.name }}
            </label>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="font-bold text-slate-900 mb-4">Photos du bien</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div v-for="(img, idx) in formData.images" :key="idx" class="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
            <img :src="img" class="w-full h-full object-cover" />
            <button 
              type="button" 
              @click="removeImage(idx)"
              class="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
            >
              <X class="h-3 w-3" />
            </button>
          </div>
        </div>
        <div class="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <Upload class="h-8 w-8 mx-auto text-slate-400 mb-2" />
          <p class="text-sm text-slate-500 mb-2">Cliquez pour ajouter des photos</p>
          <button type="button" @click="triggerFileInput" class="text-sm font-semibold text-blue-600">Parcourir les fichiers</button>
          <input ref="fileInput" type="file" class="hidden" accept="image/*" multiple @change="handleFileChange" />
        </div>
      </div>

      <div class="flex items-center justify-end gap-4">
        <router-link :to="`/agent/biens/${property?.id}`" class="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          Annuler
        </router-link>
        <button 
          type="submit" 
          :disabled="isSaving"
          class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save class="h-4 w-4" />
          {{ isSaving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Upload, X, Save, Building2 } from 'lucide-vue-next'
import { mockOptions } from '@/lib/mock-data'
import { getProperty, getPropertyOptions, updateProperty } from '@/lib/api'

const route = useRoute()
const router = useRouter()

const property = ref<any | null>(null)
const isLoadingProperty = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const options = ref(mockOptions)
const fileInput = ref<HTMLInputElement | null>(null)

const formData = reactive({
  title: '',
  type: 'villa',
  description: '',
  address: '',
  city: 'abidjan',
  surface: 0,
  bedrooms: 0,
  bathrooms: 0,
  capacity: 0,
  pricePerNight: 0,
  status: 'disponible',
  options: [] as string[],
  images: [] as string[],
})

const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  for (let index = 0; index < files.length; index += 1) {
    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result
      if (typeof result === 'string') {
        formData.images.unshift(result)
      }
    }
    reader.readAsDataURL(files[index])
  }
}

const removeImage = (index: number) => {
  formData.images.splice(index, 1)
}

onMounted(async () => {
  try {
    options.value = await getPropertyOptions()
  } catch {
    options.value = mockOptions
  }

  try {
    const loaded = await getProperty(String(route.params.id))
    property.value = loaded

    formData.title = loaded.title
    formData.type = loaded.type || 'villa'
    formData.description = loaded.description || ''
    formData.address = loaded.address || ''
    formData.city = loaded.city || 'abidjan'
    formData.surface = Number(loaded.surface ?? 0)
    formData.bedrooms = Number(loaded.bedrooms ?? 0)
    formData.bathrooms = Number(loaded.bathrooms ?? 0)
    formData.capacity = Number(loaded.capacity ?? 0)
    formData.pricePerNight = Number(loaded.pricePerNight ?? 0)
    formData.status = loaded.status || 'disponible'
    formData.options = (loaded.options ?? []).map((option: any) => String(option.id))
    formData.images = [...(loaded.images ?? [])]
  } catch {
    property.value = null
  } finally {
    isLoadingProperty.value = false
  }
})

const handleSubmit = async () => {
  if (!property.value) return

  errorMessage.value = ''
  isSaving.value = true

  try {
    await updateProperty(String(route.params.id), {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      address: formData.address,
      city: formData.city,
      pricePerNight: Number(formData.pricePerNight),
      surface: Number(formData.surface),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      capacity: Number(formData.capacity),
      status: formData.status as 'disponible' | 'reserve' | 'maintenance',
      options: formData.options,
    })

    router.push('/agent/biens')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Impossible d’enregistrer les modifications.'
  } finally {
    isSaving.value = false
  }
}
</script>