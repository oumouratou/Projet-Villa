<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Tableau de bord Administrateur</h1>
      <p class="text-slate-500 mt-1">Vue d'ensemble de la plateforme</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in mainStats" :key="stat.title" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div class="flex flex-row items-center justify-between pb-2">
          <span class="text-sm font-medium text-slate-500">{{ stat.title }}</span>
          <component :is="stat.icon" class="h-4 w-4 text-slate-400" />
        </div>
        <div>
          <div class="text-2xl font-bold text-slate-900">{{ stat.value }}</div>
          <div class="flex items-center gap-1 mt-1">
            <component 
              :is="stat.changeType === 'positive' ? ArrowUpRight : ArrowDownRight" 
              :class="['h-4 w-4', stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600']"
            />
            <span :class="['text-xs font-medium', stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600']">
              {{ stat.change }}
            </span>
            <span class="text-xs text-slate-400 ml-1">{{ stat.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div 
        v-for="stat in quickStats" 
        :key="stat.title"
        @click="navigate(stat.href)"
        class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <component :is="stat.icon" class="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
            <p class="text-sm text-slate-500">{{ stat.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-900 flex items-center gap-2">
              <UserCog class="h-5 w-5 text-blue-600" />
              Agents récents
            </h3>
            <p class="text-sm text-slate-500">Liste des agents de l'agence</p>
          </div>
          <button @click="navigate('/admin/utilisateurs')" class="text-sm font-medium text-blue-600 hover:underline">
            Voir tout
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div 
            v-for="agent in recentAgents" 
            :key="agent.id"
            class="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                {{ agent.firstName[0] }}{{ agent.lastName[0] }}
              </div>
              <div>
                <p class="font-semibold text-sm text-slate-900">{{ agent.firstName }} {{ agent.lastName }}</p>
                <p class="text-xs text-slate-500">{{ agent.email }}</p>
              </div>
            </div>
            <span 
              :class="[
                'px-2 py-1 rounded-full text-[10px] font-bold uppercase',
                agent.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
              ]"
            >
              {{ agent.status }}
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h3 class="font-bold text-slate-900 flex items-center gap-2">
            <Activity class="h-5 w-5 text-blue-600" />
            Activité récente
          </h3>
          <p class="text-sm text-slate-500">Dernières actions sur la plateforme</p>
        </div>
        <div class="p-6 space-y-6">
          <div v-for="(activity, idx) in activities" :key="idx" class="flex items-start gap-4">
            <div :class="['w-2 h-2 mt-1.5 rounded-full shrink-0', activity.colorClass]" />
            <div class="flex-1">
              <p class="text-sm font-semibold text-slate-900">{{ activity.action }}</p>
              <p class="text-xs text-slate-500">
                par {{ activity.user }} • {{ activity.time }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <h3 class="font-bold text-slate-900">Répartition des réservations par statut</h3>
      </div>
      <div class="p-6">
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="p-4 rounded-xl bg-green-50 border border-green-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span class="text-lg font-bold text-green-600">{{ countStatus('confirmee') }}</span>
              </div>
              <div>
                <p class="font-bold text-green-900">Confirmées</p>
                <p class="text-xs text-green-600 font-medium">{{ getPercentage('confirmee') }}% du total</p>
              </div>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span class="text-lg font-bold text-amber-600">{{ countStatus('en_attente') }}</span>
              </div>
              <div>
                <p class="font-bold text-amber-900">En attente</p>
                <p class="text-xs text-amber-600 font-medium">{{ getPercentage('en_attente') }}% du total</p>
              </div>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-red-50 border border-red-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span class="text-lg font-bold text-red-600">{{ countStatus('refusee') }}</span>
              </div>
              <div>
                <p class="font-bold text-red-900">Refusées</p>
                <p class="text-xs text-red-600 font-medium">{{ getPercentage('refusee') }}% du total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Building2, CalendarCheck, MessageSquare, Users, TrendingUp,
  ArrowUpRight, ArrowDownRight, DollarSign, UserCog, Shield, Activity
} from 'lucide-vue-next'
import { getList } from '@/lib/api'

const router = useRouter()

const properties = ref<any[]>([])
const reservations = ref<any[]>([])
const clients = ref<any[]>([])
const complaints = ref<any[]>([])
const agents = ref<any[]>([])

const totalRevenue = computed(() => reservations.value.filter((r) => r.status === 'confirmee').reduce((sum, r) => sum + Number(r.total_price || r.totalPrice || 0), 0))

const mainStats = computed(() => [
  { title: 'Revenus totaux', value: `${totalRevenue.value.toLocaleString()} FCFA`, icon: DollarSign, change: '+12.5%', changeType: 'positive', description: 'vs mois dernier' },
  { title: 'Biens actifs', value: properties.value.length, icon: Building2, change: '+3', changeType: 'positive', description: 'nouveaux ce mois' },
  { title: 'Réservations', value: reservations.value.length, icon: CalendarCheck, change: '+18%', changeType: 'positive', description: 'vs mois dernier' },
  { title: 'Clients inscrits', value: clients.value.length, icon: Users, change: '+24%', changeType: 'positive', description: 'nouveaux ce mois' },
])

const quickStats = computed(() => [
  { title: 'Agents', value: agents.value.length, icon: UserCog, href: '/admin/utilisateurs' },
  { title: 'Réclamations', value: complaints.value.filter((c) => c.status === 'ouverte' || c.status === 'nouvelle').length, icon: MessageSquare, href: '/admin/permissions' },
  { title: "Taux d'occupation", value: '78%', icon: TrendingUp, href: '/admin/parametres' },
  { title: 'Rôles', value: 3, icon: Shield, href: '/admin/roles' },
])

const recentAgents = computed(() => agents.value.slice(0, 4))
const activities = [
  { action: 'Nouvelle réservation', user: 'Système', time: 'Maintenant', colorClass: 'bg-green-500' },
  { action: 'Bien ajouté', user: 'Système', time: 'Il y a 15 min', colorClass: 'bg-blue-500' },
  { action: 'Réclamation traitée', user: 'Système', time: 'Il y a 30 min', colorClass: 'bg-orange-500' },
  { action: 'Client inscrit', user: 'Système', time: 'Il y a 1h', colorClass: 'bg-blue-400' },
]

const countStatus = (status: string) => reservations.value.filter((r) => r.status === status).length
const getPercentage = (status: string) => {
  if (reservations.value.length === 0) return 0
  return Math.round((countStatus(status) / reservations.value.length) * 100)
}

const navigate = (path: string) => {
  if (!path || path === '#') {
    return
  }

  router.push(path)
}

onMounted(async () => {
  try { properties.value = await getList('/properties') } catch { properties.value = [] }
  try { reservations.value = await getList('/reservations') } catch { reservations.value = [] }
  try { clients.value = await getList('/clients') } catch { clients.value = [] }
  try { complaints.value = await getList('/reclamations') } catch { complaints.value = [] }
  try { agents.value = (await getList('/users')).filter((user: any) => user.role === 'agent') } catch { agents.value = [] }
})
</script>