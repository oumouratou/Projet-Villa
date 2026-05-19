<template>
  <div class="space-y-6 p-6 lg:p-8 max-w-7xl mx-auto bg-slate-50 min-h-full">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-950 tracking-tight">Tableau de bord Administrateur</h1>
        <p class="mt-1 text-slate-500">Vue d'ensemble et gestion complète de la plateforme.</p>
      </div>
    </div>

    <!-- Main Stats -->
    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in mainStats" :key="stat.title" class="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
          <span class="text-sm font-bold text-slate-500">{{ stat.title }}</span>
          <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
            <component :is="stat.icon" class="h-5 w-5 text-sky-600" />
          </div>
        </div>
        <div class="mt-4">
          <div class="text-3xl font-black text-slate-900">{{ stat.value }}</div>
          <div class="flex items-center gap-1.5 mt-2">
            <span 
              :class="['flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold', stat.changeType === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600']"
            >
              <component :is="stat.changeType === 'positive' ? ArrowUpRight : ArrowDownRight" class="h-3 w-3" />
              {{ stat.change }}
            </span>
            <span class="text-xs font-medium text-slate-400">{{ stat.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions/Stats -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div 
        v-for="stat in quickStats" 
        :key="stat.title"
        @click="navigate(stat.href)"
        class="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-500 transition-colors duration-300">
            <component :is="stat.icon" class="h-6 w-6 text-sky-600 group-hover:text-white transition-colors duration-300" />
          </div>
          <div>
            <p class="text-2xl font-black text-slate-900">{{ stat.value }}</p>
            <p class="text-sm font-semibold text-slate-500 group-hover:text-sky-600 transition-colors">{{ stat.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Recent Agents -->
      <div class="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-950 flex items-center gap-2">
              <UserCog class="h-5 w-5 text-sky-600" />
              Agents récents
            </h3>
            <p class="text-xs font-medium text-slate-500 mt-0.5">Liste des agents de la plateforme</p>
          </div>
          <button @click="navigate('/admin/utilisateurs')" class="text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors">
            Voir tout
          </button>
        </div>
        <div class="p-6 flex-1">
          <div class="space-y-4">
            <div 
              v-for="agent in recentAgents" 
              :key="agent.id"
              class="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:shadow-sm transition-all"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-black text-lg">
                  {{ agent.firstName[0] }}{{ agent.lastName[0] }}
                </div>
                <div>
                  <p class="font-bold text-slate-900">{{ agent.firstName }} {{ agent.lastName }}</p>
                  <p class="text-xs font-medium text-slate-500 mt-0.5">{{ agent.email }}</p>
                </div>
              </div>
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide',
                  agent.status === 'actif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                ]"
              >
                {{ agent.status }}
              </span>
            </div>
            <div v-if="recentAgents.length === 0" class="text-center py-6">
              <p class="text-sm text-slate-500 font-medium">Aucun agent trouvé.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 class="font-bold text-slate-950 flex items-center gap-2">
            <Activity class="h-5 w-5 text-sky-600" />
            Activité récente
          </h3>
          <p class="text-xs font-medium text-slate-500 mt-0.5">Dernières actions sur la plateforme</p>
        </div>
        <div class="p-6 flex-1">
          <div class="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            <div v-for="(activity, idx) in activities" :key="idx" class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <!-- Timeline Icon -->
              <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" :class="[activity.colorClass.replace('bg-', 'text-')]">
                <div class="w-3 h-3 rounded-full" :class="activity.colorClass"></div>
              </div>
              <!-- Content -->
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div class="flex items-center justify-between space-x-2 mb-1">
                  <div class="font-bold text-slate-900 text-sm">{{ activity.action }}</div>
                  <time class="text-xs font-medium text-sky-600">{{ activity.time }}</time>
                </div>
                <div class="text-slate-500 text-xs font-medium">par {{ activity.user }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reservation Status Distribution -->
    <div class="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 class="font-bold text-slate-950 flex items-center gap-2">
          <CalendarCheck class="h-5 w-5 text-sky-600" />
          Répartition des réservations par statut
        </h3>
      </div>
      <div class="p-6">
        <div class="grid gap-5 sm:grid-cols-3">
          <div class="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-emerald-50">
                <span class="text-2xl font-black text-emerald-600">{{ countStatus('confirmee') }}</span>
              </div>
              <div>
                <p class="font-black text-slate-900">Confirmées</p>
                <p class="text-xs font-bold text-emerald-600 mt-0.5">{{ getPercentage('confirmee') }}% du total</p>
              </div>
            </div>
            <div class="mt-4 w-full bg-emerald-100 rounded-full h-1.5">
              <div class="bg-emerald-500 h-1.5 rounded-full" :style="`width: ${getPercentage('confirmee')}%`"></div>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-amber-50">
                <span class="text-2xl font-black text-amber-500">{{ countStatus('en_attente') }}</span>
              </div>
              <div>
                <p class="font-black text-slate-900">En attente</p>
                <p class="text-xs font-bold text-amber-500 mt-0.5">{{ getPercentage('en_attente') }}% du total</p>
              </div>
            </div>
            <div class="mt-4 w-full bg-amber-100 rounded-full h-1.5">
              <div class="bg-amber-400 h-1.5 rounded-full" :style="`width: ${getPercentage('en_attente')}%`"></div>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-red-50/50 border border-red-100 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-red-50">
                <span class="text-2xl font-black text-red-500">{{ countStatus('refusee') }}</span>
              </div>
              <div>
                <p class="font-black text-slate-900">Refusées</p>
                <p class="text-xs font-bold text-red-500 mt-0.5">{{ getPercentage('refusee') }}% du total</p>
              </div>
            </div>
            <div class="mt-4 w-full bg-red-100 rounded-full h-1.5">
              <div class="bg-red-400 h-1.5 rounded-full" :style="`width: ${getPercentage('refusee')}%`"></div>
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