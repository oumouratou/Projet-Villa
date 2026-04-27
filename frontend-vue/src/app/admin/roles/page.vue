<template>
  <div class="space-y-6 p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Gestion des rôles</h1>
        <p class="text-slate-500 mt-1">Configurez les rôles et niveaux d'accès</p>
      </div>
      <button 
        @click="openAddDialog"
        class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm"
      >
        <Plus class="mr-2 h-4 w-4" />
        Créer un rôle
      </button>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="role in roles" 
        :key="role.id" 
        class="bg-white rounded-xl border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow flex flex-col"
      >
        <span 
          v-if="role.isSystem" 
          class="absolute top-4 right-4 px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md border border-slate-200"
        >
          Système
        </span>

        <div class="p-6 flex-1">
          <div class="flex items-center gap-3 mb-4">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center shadow-sm',
              role.name === 'Administrateur' ? 'bg-blue-50 text-blue-600' :
              role.name === 'Agent' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
            ]">
              <Shield class="h-6 w-6" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ role.name }}</h3>
              <p class="text-xs text-slate-500 line-clamp-1">{{ role.description }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 mb-4 text-slate-500">
            <Users class="h-4 w-4" />
            <span class="text-sm">{{ role.usersCount }} utilisateur(s)</span>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="perm in role.permissions.slice(0, 3)" 
              :key="perm"
              class="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded text-[11px] font-medium"
            >
              {{ perm === 'all' ? 'Toutes' : perm.split('.')[0] }}
            </span>
            <span 
              v-if="role.permissions.length > 3"
              class="px-2 py-0.5 bg-white text-blue-600 border border-blue-100 rounded text-[11px] font-bold"
            >
              +{{ role.permissions.length - 3 }}
            </span>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center gap-2">
          <button 
            @click="openEditDialog(role)"
            class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Edit class="h-4 w-4" />
            Modifier
          </button>
          <button 
            v-if="!role.isSystem"
            @click="deleteRole(role.id)"
            class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-slate-100">
          <h3 class="text-xl font-bold text-slate-900">
            {{ isEditing ? 'Modifier le rôle' : 'Nouveau rôle' }}
          </h3>
          <p class="text-sm text-slate-500">
            {{ isEditing ? 'Modifiez les informations de ce rôle' : 'Créez un nouveau rôle avec des permissions personnalisées' }}
          </p>
        </div>

        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-bold text-slate-700">Nom du rôle *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              :disabled="formData.isSystem"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="Ex: Superviseur"
            />
          </div>
          
          <div class="space-y-1">
            <label class="text-sm font-bold text-slate-700">Description</label>
            <textarea 
              v-model="formData.description" 
              rows="3"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
              placeholder="Décrivez les responsabilités..."
            ></textarea>
          </div>

          <div v-if="isEditing" class="p-3 bg-blue-50 rounded-lg flex items-center gap-3">
            <Users class="h-5 w-5 text-blue-600" />
            <span class="text-sm text-blue-700 font-medium">Ce rôle est actuellement assigné à {{ formData.usersCount }} utilisateurs.</span>
          </div>
        </div>

        <div class="p-6 bg-slate-50 flex justify-end gap-3">
          <button @click="showModal = false" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Annuler
          </button>
          <button @click="saveRole" class="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-shadow shadow-md shadow-blue-200">
            {{ isEditing ? 'Enregistrer' : 'Créer le rôle' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-vue-next'

// Données initiales
const roles = ref([
  {
    id: "1",
    name: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    usersCount: 2,
    permissions: ["all"],
    isSystem: true
  },
  {
    id: "2",
    name: "Agent",
    description: "Gestion des biens, réservations et réclamations",
    usersCount: 5,
    permissions: ["biens.view", "biens.edit", "reservations.view", "reservations.edit", "reclamations.view"],
    isSystem: true
  },
  {
    id: "3",
    name: "Superviseur",
    description: "Accès en lecture seule aux statistiques",
    usersCount: 1,
    permissions: ["stats.view", "biens.view", "reservations.view"],
    isSystem: false
  }
])

// État de la modale et du formulaire
const showModal = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: "",
  name: "",
  description: "",
  isSystem: false,
  usersCount: 0
})

const openAddDialog = () => {
  isEditing.value = false
  formData.value = { id: "", name: "", description: "", isSystem: false, usersCount: 0 }
  showModal.value = true
}

const openEditDialog = (role: any) => {
  isEditing.value = true
  formData.value = { ...role }
  showModal.value = true
}

const saveRole = () => {
  if (isEditing.value) {
    const index = roles.value.findIndex(r => r.id === formData.value.id)
    if (index !== -1) roles.value[index] = { ...roles.value[index], ...formData.value }
  } else {
    roles.value.push({
      ...formData.value,
      id: Date.now().toString(),
      usersCount: 0,
      permissions: ["biens.view"] // Permission par défaut
    })
  }
  showModal.value = false
}

const deleteRole = (id: string) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
    roles.value = roles.value.filter(r => r.id !== id)
  }
}
</script>