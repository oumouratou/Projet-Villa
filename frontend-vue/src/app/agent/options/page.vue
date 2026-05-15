<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Plus, Search, Edit2, Trash2, Save, X,
  Wifi, Car, Waves, Wind, Trees, Droplet, Sparkles,
  CheckCircle2, AlertCircle
} from 'lucide-vue-next'
import { getList } from '@/lib/api'
import { getStoredToken } from '@/lib/session'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

const options    = ref<any[]>([])
const loading    = ref(true)
const searchTerm = ref('')
const showForm   = ref(false)
const editingId  = ref<string | null>(null)
const saving     = ref(false)
const deleting   = ref<string | null>(null)
const toast      = ref<{ msg: string; type: 'ok' | 'err' } | null>(null)

const form = reactive({ name: '', icon: 'sparkles', description: '' })

const iconOptions = [
  { value: 'wifi',     label: 'Wi-Fi',        icon: Wifi },
  { value: 'waves',    label: 'Piscine',       icon: Waves },
  { value: 'car',      label: 'Parking',       icon: Car },
  { value: 'wind',     label: 'Climatisation', icon: Wind },
  { value: 'trees',    label: 'Jardin',        icon: Trees },
  { value: 'droplet',  label: 'Spa',           icon: Droplet },
  { value: 'sparkles', label: 'Autre',         icon: Sparkles },
]

const iconMap: Record<string, any> = Object.fromEntries(
  iconOptions.map(o => [o.value, o.icon])
)
const getIcon = (v: string) => iconMap[v?.toLowerCase()] ?? Sparkles

const filtered = computed(() =>
  options.value.filter(o =>
    o.name?.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)

const authHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getStoredToken()}`,
})

const readJsonResponse = async (response: Response) => {
  const text = await response.text()

  if (!text.trim()) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(text.includes('<!DOCTYPE')
      ? 'Le serveur a renvoyé une page HTML au lieu du JSON attendu.'
      : text)
  }
}

const showToast = (msg: string, type: 'ok' | 'err') => {
  toast.value = { msg, type }
  setTimeout(() => { toast.value = null }, 3500)
}

const load = async () => {
  loading.value = true
  try { options.value = await getList('/options') }
  catch { options.value = [] }
  finally { loading.value = false }
}

const openCreate = () => {
  editingId.value = null
  form.name = ''; form.icon = 'sparkles'; form.description = ''
  showForm.value = true
}

const openEdit = (opt: any) => {
  editingId.value  = String(opt.id)
  form.name        = opt.name ?? ''
  form.icon        = opt.icon ?? 'sparkles'
  form.description = opt.description ?? ''
  showForm.value   = true
}

const cancelForm = () => { showForm.value = false; editingId.value = null }

const saveOption = async () => {
  if (!form.name.trim()) { showToast('Le nom est requis', 'err'); return }
  saving.value = true
  try {
    const url    = editingId.value
      ? `${API_BASE}/options/${editingId.value}`
      : `${API_BASE}/options`
    const method = editingId.value ? 'PUT' : 'POST'
    const res    = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify({ name: form.name.trim(), icon: form.icon, description: form.description })
    })
    const json = await readJsonResponse(res)
    if (!res.ok) throw new Error(json?.message ?? 'Erreur')
    const saved = json.data
    if (editingId.value) {
      const idx = options.value.findIndex(o => String(o.id) === editingId.value)
      if (idx !== -1) options.value[idx] = saved
    } else {
      options.value.unshift(saved)
    }
    showToast(editingId.value ? 'Option modifiée ✅' : 'Option créée ✅', 'ok')
    cancelForm()
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Erreur', 'err')
  } finally { saving.value = false }
}

const deleteOption = async (id: string) => {
  if (!confirm('Supprimer cette option ?')) return
  deleting.value = id
  try {
    const res = await fetch(`${API_BASE}/options/${id}`, {
      method: 'DELETE', headers: authHeaders()
    })
    if (!res.ok) {
      const json = await readJsonResponse(res)
      throw new Error(json?.message ?? 'Erreur')
    }
    options.value = options.value.filter(o => String(o.id) !== id)
    showToast('Option supprimée', 'ok')
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Erreur', 'err')
  } finally { deleting.value = null }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6 p-6">

    <transition name="fade">
      <div v-if="toast"
        class="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-xl font-semibold text-sm"
        :class="toast.type === 'ok'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'">
        <CheckCircle2 v-if="toast.type === 'ok'" class="h-5 w-5" />
        <AlertCircle v-else class="h-5 w-5" />
        {{ toast.msg }}
      </div>
    </transition>

    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-foreground">Gestion des options</h1>
        <p class="mt-1 text-muted-foreground">
          Créez et gérez les équipements des biens (Wi-Fi, Piscine, Parking...)
        </p>
      </div>
      <button @click="openCreate"
        class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
        <Plus class="h-5 w-5" />Ajouter une option
      </button>
    </div>

    <transition name="fade">
      <div v-if="showForm"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between border-b border-border p-5">
            <h2 class="font-bold text-foreground text-lg">
              {{ editingId ? 'Modifier' : 'Nouvelle' }} option
            </h2>
            <button @click="cancelForm" class="rounded-full p-1 hover:bg-muted transition-colors">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-foreground">Nom *</label>
              <input v-model="form.name" placeholder="Ex: Piscine, Wi-Fi, Parking..."
                class="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-foreground">Icône</label>
              <div class="grid grid-cols-4 gap-2">
                <button v-for="opt in iconOptions" :key="opt.value" type="button"
                  @click="form.icon = opt.value"
                  class="flex flex-col items-center gap-1 rounded-xl border-2 p-2.5 text-xs font-medium transition-all"
                  :class="form.icon === opt.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input hover:border-primary/50'">
                  <component :is="opt.icon" class="h-5 w-5" />
                  <span class="text-[10px]">{{ opt.label }}</span>
                </button>
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-foreground">Description</label>
              <textarea v-model="form.description" rows="2" placeholder="Description courte..."
                class="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div class="flex gap-3 border-t border-border p-5">
            <button @click="cancelForm"
              class="flex-1 rounded-xl border border-input py-2.5 text-sm font-semibold hover:bg-muted transition-colors">
              Annuler
            </button>
            <button @click="saveOption" :disabled="saving"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
              <Save class="h-4 w-4" />{{ saving ? 'Sauvegarde...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="relative max-w-sm">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input v-model="searchTerm" placeholder="Rechercher..."
        class="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
    </div>

    <div v-if="loading" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <div v-for="i in 8" :key="i" class="h-32 animate-pulse rounded-2xl bg-muted" />
    </div>

    <div v-else-if="filtered.length === 0" class="flex flex-col items-center py-16 text-center">
      <Sparkles class="mb-3 h-12 w-12 text-muted-foreground" />
      <p class="font-semibold text-muted-foreground">Aucune option</p>
      <button @click="openCreate"
        class="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
        <Plus class="h-4 w-4" />Créer une option
      </button>
    </div>

    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <div v-for="opt in filtered" :key="opt.id"
        class="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
        <div class="flex flex-col items-center gap-3 text-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <component :is="getIcon(opt.icon)" class="h-7 w-7 text-primary" />
          </div>
          <div>
            <p class="font-bold text-foreground">{{ opt.name }}</p>
            <p v-if="opt.description" class="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {{ opt.description }}
            </p>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button @click="openEdit(opt)"
            class="flex flex-1 items-center justify-center gap-1 rounded-lg border border-input py-1.5 text-xs font-medium hover:bg-muted transition-colors">
            <Edit2 class="h-3.5 w-3.5" />Modifier
          </button>
          <button @click="deleteOption(String(opt.id))"
            :disabled="deleting === String(opt.id)"
            class="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 border border-red-200 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors">
            <Trash2 class="h-3.5 w-3.5" />Supprimer
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>