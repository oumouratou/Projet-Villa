<template>
  <div class="space-y-6 p-6">
    <div v-if="!agent" class="flex flex-col items-center justify-center py-12">
      <h1 class="text-2xl font-bold text-slate-900">Utilisateur non trouvé</h1>
      <button 
        @click="goToHome"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retour à la liste
      </button>
    </div>

    <template v-else>
      <div class="flex items-center gap-4">
        <button 
          @click="goBack"
          class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          <ArrowLeft class="h-6 w-6" />
        </button>
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Modifier l'utilisateur</h1>
          <p class="text-slate-500 mt-1">
            {{ agent.firstName }} {{ agent.lastName }}
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <div class="flex items-center gap-2 font-bold text-slate-900">
              <UserCog class="h-5 w-5 text-blue-600" />
              Informations personnelles
            </div>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Prénom *</label>
                <input 
                  v-model="form.firstName"
                  type="text" 
                  class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Nom *</label>
                <input 
                  v-model="form.lastName"
                  type="text" 
                  class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Email *</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  v-model="form.email"
                  type="email" 
                  class="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Téléphone</label>
              <div class="relative">
                <Phone class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  v-model="form.phone"
                  type="tel" 
                  class="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h3 class="font-bold text-slate-900">Rôle et accès</h3>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Rôle *</label>
              <select 
                v-model="form.role"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="agent">Agent</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Statut *</label>
              <select 
                v-model="form.status"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <div class="flex items-center gap-2 font-bold text-slate-900">
              <Lock class="h-5 w-5 text-amber-500" />
              Changer le mot de passe
            </div>
            <p class="text-xs text-slate-500 mt-1">Laissez vide pour conserver le mot de passe actuel</p>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Nouveau mot de passe</label>
              <input 
                v-model="form.password"
                type="password" 
                placeholder="••••••••"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Confirmer le nouveau mot de passe</label>
              <input 
                v-model="form.password_confirmation"
                type="password" 
                placeholder="••••••••"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-4">
          <button 
            type="button" 
            @click="goBack"
            class="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            type="submit"
            class="inline-flex items-center px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-md"
          >
            <Save class="mr-2 h-4 w-4" />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save, UserCog, Lock, Mail, Phone } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const STORAGE_KEY = 'admin-users'

const defaultUsers = [
  { id: '1', firstName: 'Jean', lastName: 'Dupont', email: 'jean@example.com', phone: '+2250102030405', role: 'admin', status: 'actif' },
  { id: '2', firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com', phone: '+2250607080910', role: 'agent', status: 'actif' },
  { id: '3', firstName: 'Paul', lastName: 'Lambert', email: 'paul@example.com', phone: '+2250708091011', role: 'agent', status: 'inactif' },
]

const agent = ref<any>(null)
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  status: '',
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  const id = String(route.params.id)

  let source = defaultUsers
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        source = parsed
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
    }
  } catch {
    source = defaultUsers
  }

  // Recherche de l'utilisateur
  const found = source.find((a: any) => String(a.id) === id)
  if (found) {
    agent.value = found
    // Pré-remplissage du formulaire
    form.value = {
      ...found,
      password: '',
      password_confirmation: ''
    }
  }
})

const goBack = () => router.push('/admin/utilisateurs')
const goToHome = () => router.push('/admin/utilisateurs')

const handleSubmit = () => {
  if (form.value.password && form.value.password !== form.value.password_confirmation) {
    alert("Les nouveaux mots de passe ne correspondent pas")
    return
  }
  
  const userId = String(route.params.id)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const users = raw ? JSON.parse(raw) : defaultUsers
    const next = users.map((user: any) => {
      if (String(user.id) !== userId) {
        return user
      }

      return {
        ...user,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phone: form.value.phone,
        role: form.value.role,
        status: form.value.status,
      }
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    alert('Modifications enregistrées !')
    router.push(`/admin/utilisateurs/${userId}`)
  } catch {
    alert('Impossible de sauvegarder les modifications')
  }
}
</script>