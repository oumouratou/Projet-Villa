<template>
  <div class="space-y-6 p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Gestion des permissions</h1>
        <p class="text-slate-500 mt-1">Configurez les permissions par rôle</p>
      </div>
      <button 
        @click="isAddDialogOpen = true"
        class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
      >
        <Plus class="mr-2 h-4 w-4" />
        Nouvelle permission
      </button>
    </div>

    <div class="grid gap-6 lg:grid-cols-4">
      <aside class="lg:col-span-1 space-y-4">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div class="flex items-center gap-2 font-semibold text-slate-900 mb-4">
            <Shield class="h-5 w-5 text-blue-600" />
            Rôles
          </div>
          <div class="space-y-2">
            <button
              v-for="role in roles"
              :key="role.id"
              @click="selectedRoleId = role.id"
              :class="[
                'w-full text-left p-3 rounded-lg border transition-all',
                selectedRoleId === role.id 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' 
                  : 'hover:bg-slate-50 border-slate-100 text-slate-700'
              ]"
            >
              <p class="font-bold">{{ role.name }}</p>
              <p :class="['text-xs', selectedRoleId === role.id ? 'text-blue-100' : 'text-slate-400']">
                {{ role.permissions.includes('all') ? 'Toutes les permissions' : `${role.permissions.length} actives` }}
              </p>
            </button>
          </div>
        </div>
      </aside>

      <main class="lg:col-span-3">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div>
              <h2 class="text-xl font-bold text-slate-900">Permissions - {{ currentRole?.name }}</h2>
              <p class="text-sm text-slate-500">Cochez les permissions à accorder à ce rôle</p>
            </div>
            <button @click="savePermissions" class="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm">
              <Save class="mr-2 h-4 w-4" />
              Enregistrer
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div v-for="group in permissionGroups" :key="group.name" class="border border-slate-200 rounded-xl overflow-hidden">
              <button 
                @click="toggleGroup(group.name)"
                class="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <component :is="group.icon" class="h-5 w-5" />
                  </div>
                  <div class="text-left">
                    <p class="font-bold text-slate-900">{{ group.name }}</p>
                    <p class="text-xs text-slate-500">{{ getActiveCount(group) }}/{{ group.permissions.length }} actives</p>
                  </div>
                </div>
                <ChevronDown :class="['h-5 w-5 text-slate-400 transition-transform', openedGroups.includes(group.name) ? 'rotate-180' : '']" />
              </button>

              <div v-show="openedGroups.includes(group.name)" class="p-4 bg-slate-50/50 border-t border-slate-100 grid gap-3 sm:grid-cols-2">
                <div 
                  v-for="perm in group.permissions" 
                  :key="perm.id"
                  @click="togglePermission(perm.id)"
                  :class="[
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                    hasPermission(perm.id) ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-white border-slate-200 opacity-60'
                  ]"
                >
                  <div :class="['w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors', hasPermission(perm.id) ? 'bg-green-600 border-green-600' : 'bg-white border-slate-300']">
                    <Check v-if="hasPermission(perm.id)" class="h-3 w-3 text-white" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-slate-900">{{ perm.name }}</p>
                    <p class="text-xs text-slate-500 leading-tight">{{ perm.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="isAddDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h3 class="text-lg font-bold text-slate-900">Nouvelle permission</h3>
          <p class="text-sm text-slate-500">Créez une nouvelle permission personnalisée</p>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-semibold text-slate-700">Nom de la permission *</label>
            <input type="text" placeholder="Ex: rapports.view" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-semibold text-slate-700">Libellé</label>
            <input type="text" placeholder="Ex: Voir les rapports" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
        </div>
        <div class="p-6 bg-slate-50 flex justify-end gap-3">
          <button @click="isAddDialogOpen = false" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
          <button @click="isAddDialogOpen = false" class="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Créer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Plus, Shield, Building2, CalendarCheck, 
  Save, 
  ChevronDown, Check 
} from 'lucide-vue-next'

// Données des groupes (comme dans ton React)
type PermissionItem = {
  id: string
  name: string
  description: string
}

type PermissionGroup = {
  name: string
  icon: unknown
  permissions: PermissionItem[]
}

const permissionGroups: PermissionGroup[] = [
  {
    name: "Biens immobiliers",
    icon: Building2,
    permissions: [
      { id: "biens.view", name: "Voir les biens", description: "Accès en lecture aux biens" },
      { id: "biens.create", name: "Créer des biens", description: "Ajouter de nouveaux biens" },
      { id: "biens.edit", name: "Modifier les biens", description: "Éditer les biens existants" },
      { id: "biens.delete", name: "Supprimer les biens", description: "Supprimer des biens" },
    ]
  },
  {
    name: "Réservations",
    icon: CalendarCheck,
    permissions: [
      { id: "reservations.view", name: "Voir les réservations", description: "Accès en lecture" },
      { id: "reservations.confirm", name: "Confirmer", description: "Confirmer les réservations" },
      { id: "reservations.reject", name: "Refuser", description: "Refuser les réservations" },
    ]
  },
  // ... Ajoute les autres groupes ici
]

const roles = ref([
  { id: "admin", name: "Administrateur", permissions: ["all"] },
  { id: "agent", name: "Agent", permissions: ["biens.view", "biens.create", "reservations.view"] },
  { id: "supervisor", name: "Superviseur", permissions: ["biens.view", "reservations.view"] },
])

const selectedRoleId = ref("agent")
const isAddDialogOpen = ref(false)
const openedGroups = ref(["Biens immobiliers"]) // Groupes ouverts par défaut

const currentRole = computed(() => roles.value.find(r => r.id === selectedRoleId.value))

const hasPermission = (permId: string) => {
  return currentRole.value?.permissions.includes("all") || currentRole.value?.permissions.includes(permId)
}

const toggleGroup = (name: string) => {
  if (openedGroups.value.includes(name)) {
    openedGroups.value = openedGroups.value.filter(g => g !== name)
  } else {
    openedGroups.value.push(name)
  }
}

const togglePermission = (permId: string) => {
  if (!currentRole.value || currentRole.value.permissions.includes("all")) return
  
  const perms = [...currentRole.value.permissions]
  const index = perms.indexOf(permId)
  
  if (index > -1) perms.splice(index, 1)
  else perms.push(permId)
  
  currentRole.value.permissions = perms
}

const getActiveCount = (group: PermissionGroup) => {
  return group.permissions.filter(p => hasPermission(p.id)).length
}

const savePermissions = () => {
  alert(`Permissions pour ${currentRole.value?.name} enregistrées !`)
}
</script>