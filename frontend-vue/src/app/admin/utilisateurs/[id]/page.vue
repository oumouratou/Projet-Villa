<template>
  <div class="space-y-6 p-6">
    <div v-if="!agent" class="flex flex-col items-center justify-center py-12">
      <h1 class="text-2xl font-bold text-slate-900">Utilisateur non trouvé</h1>
      <button 
        @click="goBackToList"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retour à la liste
      </button>
    </div>

    <template v-else>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <button @click="goBackToList" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft class="h-6 w-6 text-slate-600" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Profil utilisateur</h1>
            <p class="text-slate-500 mt-1">Détails et statistiques de l'agent</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="goToEdit"
            class="inline-flex items-center px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
          >
            <Edit class="mr-2 h-4 w-4" />
            Modifier
          </button>
          <button 
            @click="deleteUser"
            class="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold"
          >
            <Trash2 class="mr-2 h-4 w-4" />
            Supprimer
          </button>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div class="flex flex-col items-center text-center">
              <div class="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold border-2 border-blue-100">
                {{ agent.firstName[0] }}{{ agent.lastName[0] }}
              </div>
              <h2 class="mt-4 text-xl font-bold text-slate-900">
                {{ agent.firstName }} {{ agent.lastName }}
              </h2>
              <div class="flex items-center gap-2 mt-2">
                <span 
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold inline-flex items-center',
                    agent.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  <Shield class="mr-1 h-3 w-3" />
                  {{ agent.role === 'admin' ? 'Administrateur' : 'Agent' }}
                </span>
              </div>
            </div>

            <hr class="my-6 border-slate-100" />

            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <Mail class="h-5 w-5 text-slate-400" />
                <div>
                  <p class="text-xs text-slate-500 uppercase font-bold">Email</p>
                  <p class="text-slate-900 font-medium">{{ agent.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Phone class="h-5 w-5 text-slate-400" />
                <div>
                  <p class="text-xs text-slate-500 uppercase font-bold">Téléphone</p>
                  <p class="text-slate-900 font-medium">{{ agent.phone || "Non renseigné" }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Calendar class="h-5 w-5 text-slate-400" />
                <div>
                  <p class="text-xs text-slate-500 uppercase font-bold">Membre depuis</p>
                  <p class="text-slate-900 font-medium">{{ formatDate(agent.createdAt) }}</p>
                </div>
              </div>
            </div>

            <hr class="my-6 border-slate-100" />

            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700">Compte actif</span>
              <div 
                @click="toggleStatus"
                class="w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300"
                :class="agent.status === 'actif' ? 'bg-green-500' : 'bg-slate-300'"
              >
                <div 
                  class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300"
                  :class="{ 'translate-x-5': agent.status === 'actif' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building2 class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-900">{{ stats.managedProperties }}</p>
                <p class="text-sm text-slate-500">Biens gérés</p>
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <CalendarCheck class="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-900">{{ stats.processedReservations }}</p>
                <p class="text-sm text-slate-500">Réservations</p>
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <MessageSquare class="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-900">{{ stats.handledComplaints }}</p>
                <p class="text-sm text-slate-500">Réclamations</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-100">
              <div class="flex items-center gap-2 font-bold text-slate-900">
                <Shield class="h-5 w-5 text-blue-600" />
                Permissions & Accès
              </div>
            </div>
            <div class="p-6">
              <div class="grid gap-3 sm:grid-cols-2">
                <div 
                  v-for="perm in permissions" 
                  :key="perm.name"
                  class="flex items-center justify-between p-3 rounded-lg border transition-all"
                  :class="perm.enabled ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100 opacity-60'"
                >
                  <span class="text-sm font-semibold" :class="perm.enabled ? 'text-green-800' : 'text-slate-500'">
                    {{ perm.name }}
                  </span>
                  <span 
                    class="text-[10px] uppercase px-2 py-0.5 rounded font-bold"
                    :class="perm.enabled ? 'bg-green-200 text-green-700' : 'bg-slate-200 text-slate-500'"
                  >
                    {{ perm.enabled ? 'Oui' : 'Non' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div class="p-6 border-b border-slate-100 font-bold text-slate-900 text-lg">
              Activité récente
            </div>
            <div class="p-6 space-y-4">
              <div v-for="(activity, idx) in recentActivities" :key="idx" class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span class="text-sm text-slate-700">{{ activity.action }}</span>
                <span class="text-xs text-slate-400 font-medium">{{ activity.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, 
  Shield, Building2, CalendarCheck, MessageSquare 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const STORAGE_KEY = 'admin-users'

const defaultUsers = [
  { id: '1', firstName: 'Jean', lastName: 'Dupont', email: 'jean@example.com', phone: '+2250102030405', role: 'admin', status: 'actif', createdAt: '2024-01-10T12:00:00Z' },
  { id: '2', firstName: 'Marie', lastName: 'Curie', email: 'marie@example.com', phone: '+2250607080910', role: 'agent', status: 'actif', createdAt: '2024-02-15T09:30:00Z' },
  { id: '3', firstName: 'Paul', lastName: 'Lambert', email: 'paul@example.com', phone: '+2250708091011', role: 'agent', status: 'inactif', createdAt: '2024-03-20T14:45:00Z' },
]

// État local
const agent = ref<any>(null)
const stats = ref({
  managedProperties: 12,
  processedReservations: 45,
  handledComplaints: 8
})

// Simulation données (Dans ton projet Laravel, ça viendrait de props Inertia)
onMounted(() => {
  const id = String(route.params.id)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const users = raw ? JSON.parse(raw) : defaultUsers
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
    }

    const found = Array.isArray(users) ? users.find((user: any) => String(user.id) === id) : null
    agent.value = found || null
  } catch {
    const found = defaultUsers.find((user) => String(user.id) === id)
    agent.value = found || null
  }
})

// Liste des permissions calculées selon le rôle
const permissions = computed(() => [
  { name: "Gérer les biens", enabled: true },
  { name: "Gérer les réservations", enabled: true },
  { name: "Traiter les réclamations", enabled: true },
  { name: "Voir les clients", enabled: true },
  { name: "Gérer les utilisateurs", enabled: agent.value?.role === "admin" },
  { name: "Gérer les rôles", enabled: agent.value?.role === "admin" },
  { name: "Voir les statistiques", enabled: agent.value?.role === "admin" },
  { name: "Paramètres système", enabled: agent.value?.role === "admin" },
])

const recentActivities = [
  { action: "Réservation confirmée", date: "Aujourd'hui, 14:30" },
  { action: "Bien modifié - Villa Cocody", date: "Aujourd'hui, 10:15" },
  { action: "Réclamation traitée", date: "Hier, 16:45" },
  { action: "Nouveau bien ajouté", date: "Il y a 2 jours" },
]

// Méthodes
const goBackToList = () => router.push('/admin/utilisateurs')
const goToEdit = () => {
  if (!agent.value?.id) return
  router.push(`/admin/utilisateurs/${agent.value.id}/modifier`)
}

const toggleStatus = () => {
  agent.value.status = agent.value.status === 'actif' ? 'inactif' : 'actif'

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const users = raw ? JSON.parse(raw) : defaultUsers
    const next = users.map((user: any) => String(user.id) === String(agent.value.id) ? { ...user, status: agent.value.status } : user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // no-op
  }
}

const deleteUser = () => {
  if (!agent.value?.id) return
  if (!confirm('Supprimer cet utilisateur ?')) return

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const users = raw ? JSON.parse(raw) : defaultUsers
    const next = users.filter((user: any) => String(user.id) !== String(agent.value.id))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // no-op
  }

  router.push('/admin/utilisateurs')
}
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>