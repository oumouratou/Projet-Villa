<template>
  <div class="space-y-6 p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Gestion des utilisateurs</h1>
        <p class="text-slate-500 mt-1">
          {{ mockAgents.length }} agents et administrateurs
        </p>
      </div>
      <button 
        @click="goToAdd"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
      >
        <Plus class="mr-2 h-4 w-4" />
        Ajouter un agent
      </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <UserCog class="h-6 w-6" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ mockAgents.length }}</p>
          <p class="text-sm text-slate-500">Total utilisateurs</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
          <UserCog class="h-6 w-6" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ activeCount }}</p>
          <p class="text-sm text-slate-500">Actifs</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
          <Shield class="h-6 w-6" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ adminCount }}</p>
          <p class="text-sm text-slate-500">Administrateurs</p>
        </div>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher par nom ou email..."
            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <select 
          v-model="roleFilter"
          class="w-full sm:w-[180px] px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
        >
          <option value="all">Tous les rôles</option>
          <option value="admin">Administrateur</option>
          <option value="agent">Agent</option>
        </select>
        <select 
          v-model="statusFilter"
          class="w-full sm:w-[180px] px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-900">
        <UserCog class="h-5 w-5 text-blue-600" />
        Liste des utilisateurs
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-sm uppercase font-bold">
              <th class="px-6 py-4">Utilisateur</th>
              <th class="px-6 py-4">Contact</th>
              <th class="px-6 py-4">Rôle</th>
              <th class="px-6 py-4">Date d'ajout</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="agent in filteredAgents" :key="agent.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                    {{ agent.firstName[0] }}{{ agent.lastName[0] }}
                  </div>
                  <span class="font-semibold text-slate-900">{{ agent.firstName }} {{ agent.lastName }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-sm text-slate-600">
                  <Mail class="h-4 w-4" />
                  {{ agent.email }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  :class="[
                    'px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center w-fit',
                    agent.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  <Shield class="mr-1 h-3 w-3" />
                  {{ agent.role === 'admin' ? 'Admin' : 'Agent' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ formatDate(agent.createdAt) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div 
                    @click="toggleStatus(agent)"
                    class="w-8 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors"
                    :class="agent.status === 'actif' ? 'bg-green-500' : 'bg-slate-300'"
                  >
                    <div 
                      class="bg-white w-3 h-3 rounded-full shadow transform transition-transform"
                      :class="{ 'translate-x-4': agent.status === 'actif' }"
                    ></div>
                  </div>
                  <span class="text-xs font-medium text-slate-500 capitalize">{{ agent.status }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="viewDetails(agent.id)" class="p-2 hover:bg-slate-100 rounded text-slate-600" title="Voir">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editUser(agent.id)" class="p-2 hover:bg-blue-50 rounded text-blue-600" title="Modifier">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="confirmDelete(agent.id)" class="p-2 hover:bg-red-50 rounded text-red-600" title="Supprimer">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredAgents.length === 0" class="text-center py-20">
        <UserCog class="h-12 w-12 mx-auto text-slate-300 mb-4" />
        <h3 class="text-lg font-bold text-slate-900">Aucun utilisateur trouvé</h3>
        <p class="text-slate-500">Essayez de modifier vos filtres ou vos termes de recherche.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, Plus, Eye, Edit, Trash2, 
  UserCog, Mail, Shield 
} from 'lucide-vue-next'

const router = useRouter()
const STORAGE_KEY = 'admin-users'

const defaultUsers = [
  { id: '1', firstName: 'Jean', lastName: 'Dupont', email: 'jean@example.com', role: 'admin', status: 'actif', createdAt: '2024-01-10T12:00:00Z', phone: '+2250102030405' },
  { id: '2', firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com', role: 'agent', status: 'actif', createdAt: '2024-02-15T09:30:00Z', phone: '+2250607080910' },
  { id: '3', firstName: 'Paul', lastName: 'Lambert', email: 'paul@example.com', role: 'agent', status: 'inactif', createdAt: '2024-03-20T14:45:00Z', phone: '+2250708091011' },
]

const loadUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
      return [...defaultUsers]
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return [...defaultUsers]
    }

    return parsed
  } catch {
    return [...defaultUsers]
  }
}

const persistUsers = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAgents.value))
}

// Mock Data
const mockAgents = ref<any[]>(loadUsers())

// Filtres
const searchTerm = ref("")
const roleFilter = ref("all")
const statusFilter = ref("all")

// Logique de filtrage réactive
const filteredAgents = computed(() => {
  return mockAgents.value.filter(agent => {
    const fullName = `${agent.firstName} ${agent.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.value.toLowerCase()) ||
                          agent.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesRole = roleFilter.value === "all" || agent.role === roleFilter.value
    const matchesStatus = statusFilter.value === "all" || agent.status === statusFilter.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

// Stats calculées
const activeCount = computed(() => mockAgents.value.filter(a => a.status === 'actif').length)
const adminCount = computed(() => mockAgents.value.filter(a => a.role === 'admin').length)

// Méthodes
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

const toggleStatus = (agent: any) => {
  agent.status = agent.status === 'actif' ? 'inactif' : 'actif'
  persistUsers()
}

const goToAdd = () => router.push('/admin/utilisateurs/nouveau')
const viewDetails = (id: string) => router.push(`/admin/utilisateurs/${id}`)
const editUser = (id: string) => router.push(`/admin/utilisateurs/${id}/modifier`)
const confirmDelete = (id: string) => {
  if(confirm("Supprimer cet utilisateur ?")) {
    mockAgents.value = mockAgents.value.filter(a => a.id !== id)
    persistUsers()
  }
}
</script>