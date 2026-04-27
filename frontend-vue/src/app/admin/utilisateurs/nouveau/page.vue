<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center gap-4">
      <button 
        @click="goBack"
        class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
      >
        <ArrowLeft class="h-6 w-6" />
      </button>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Ajouter un agent</h1>
        <p class="text-slate-500 mt-1">
          Créez un nouveau compte agent ou administrateur
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
          <p class="text-sm text-slate-500 mt-1">Informations de base de l'utilisateur</p>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Prénom *</label>
              <input 
                v-model="form.firstName"
                type="text" 
                placeholder="Prénom"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Nom *</label>
              <input 
                v-model="form.lastName"
                type="text" 
                placeholder="Nom"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                required
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
                placeholder="email@exemple.com"
                class="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                required
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
                placeholder="+225 XX XX XX XX XX"
                class="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h3 class="font-bold text-slate-900">Rôle et accès</h3>
          <p class="text-sm text-slate-500 mt-1">Définissez le niveau d'accès</p>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Rôle *</label>
            <select 
              v-model="form.role"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            >
              <option value="" disabled>Sélectionner un rôle</option>
              <option value="agent">Agent</option>
              <option value="admin">Administrateur</option>
            </select>
            <p class="text-[11px] text-slate-500 italic">
              Les administrateurs ont accès à toutes les fonctionnalités de la plateforme
            </p>
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
            Sécurité
          </div>
          <p class="text-sm text-slate-500 mt-1">Définissez le mot de passe initial</p>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Mot de passe *</label>
            <input 
              v-model="form.password"
              type="password" 
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
            <p class="text-[11px] text-slate-500">
              Minimum 8 caractères avec au moins une majuscule et un chiffre
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Confirmer le mot de passe *</label>
            <input 
              v-model="form.password_confirmation"
              type="password" 
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
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
          Créer l'utilisateur
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Save, UserCog, Lock, Mail, Phone } from 'lucide-vue-next'

const router = useRouter()
const STORAGE_KEY = 'admin-users'

// Objet de formulaire réactif
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  status: 'actif',
  password: '',
  password_confirmation: ''
})

const readUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const goBack = () => {
  router.push('/admin/utilisateurs')
}

const handleSubmit = () => {
  // Vérification basique des mots de passe
  if (form.value.password !== form.value.password_confirmation) {
    alert("Les mots de passe ne correspondent pas")
    return
  }

  if (form.value.password.length < 8) {
    alert('Le mot de passe doit contenir au moins 8 caractères')
    return
  }

  const users = readUsers()
  const exists = users.some((user: any) => String(user.email).toLowerCase() === form.value.email.toLowerCase())
  if (exists) {
    alert('Un utilisateur avec cet email existe déjà')
    return
  }

  const newUser = {
    id: String(Date.now()),
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    email: form.value.email,
    phone: form.value.phone,
    role: form.value.role,
    status: form.value.status,
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([newUser, ...users]))
  alert('Agent créé avec succès')
  router.push('/admin/utilisateurs')
}
</script>