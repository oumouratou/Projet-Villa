<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Building2,
  LayoutDashboard,
  User,
  Calendar,
  MessageSquare,
  Search,
  LogOut,
  Settings,
  Home,
  Users,
  Tag,
  Shield,
  Key,
  FileText,
  ChevronLeft,
  Menu,
} from 'lucide-vue-next'

type UserRole = 'admin' | 'agent' | 'client'

const props = defineProps<{ role: UserRole }>()
const route = useRoute()
const isCollapsed = ref(false)
const isMobileOpen = ref(false)

const userName = computed(() => {
  if (props.role === 'admin') return 'Marie Kone'
  if (props.role === 'agent') return 'Yao Kouadio'
  return 'Sophie Leroy'
})

// --- DONNÉES DE NAVIGATION PRÉSERVÉES ---
const clientNavItems = [
  { href: '/client', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/client/recherche', label: 'Rechercher un bien', icon: Search },
  { href: '/client/reservations', label: 'Mes reservations', icon: Calendar },
  { href: '/client/reclamations', label: 'Mes reclamations', icon: MessageSquare },
  { href: '/client/profil', label: 'Mon profil', icon: User },
]

const agentNavItems = [
  { href: '/agent', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/agent/biens', label: 'Gestion des biens', icon: Home },
  { href: '/agent/options', label: 'Options', icon: Tag },
  { href: '/agent/reservations', label: 'Reservations', icon: Calendar },
  { href: '/agent/clients', label: 'Clients', icon: Users },
  { href: '/agent/reclamations', label: 'Reclamations', icon: MessageSquare },
]

const adminNavItems = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
  { href: '/admin/roles', label: 'Roles', icon: Shield },
  { href: '/admin/permissions', label: 'Permissions', icon: Key },
  { href: '/admin/parametres', label: 'Parametres', icon: Settings },
  { href: '/admin/activites', label: 'Historique', icon: FileText },
]

const navItems = computed(() => {
  if (props.role === 'admin') return adminNavItems
  if (props.role === 'agent') return agentNavItems
  return clientNavItems
})

const isActive = (href: string) => {
  return route.path === href || route.path.startsWith(href + '/')
}
</script>

<template>
  <button
    class="fixed left-4 top-4 z-50 rounded-lg bg-[#0f172a] border border-slate-700 p-2 text-white lg:hidden"
    aria-label="Toggle menu"
    @click="isMobileOpen = !isMobileOpen"
  >
    <Menu class="h-5 w-5" />
  </button>

  <div v-if="isMobileOpen" class="fixed inset-0 z-40 bg-black/50 lg:hidden" @click="isMobileOpen = false" />

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 flex flex-col bg-[linear-gradient(180deg,#08111f_0%,#0f172a_45%,#12223d_100%)] text-slate-300 transition-all duration-300 border-r border-slate-800 lg:static',
      isCollapsed ? 'w-20' : 'w-64',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div :class="['flex h-16 items-center px-6', isCollapsed ? 'justify-center' : 'justify-between']">
      <RouterLink to="/" class="flex items-center gap-3">
        <div class="rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 p-1.5 shadow-lg shadow-blue-900/30">
          <Building2 class="h-6 w-6 text-white" />
        </div>
        <span v-if="!isCollapsed" class="font-bold text-white text-lg tracking-tight">ImmoGestion</span>
      </RouterLink>

      <button
        class="hidden h-8 w-8 items-center justify-center text-slate-500 hover:text-white transition-colors lg:flex"
        @click="isCollapsed = !isCollapsed"
      >
        <ChevronLeft :class="['h-5 w-5 transition-transform', isCollapsed ? 'rotate-180' : '']" />
      </button>
    </div>

    <nav class="flex-1 space-y-1.5 overflow-y-auto px-4 py-6 custom-scrollbar">
      <RouterLink
        v-for="item in navItems"
        :key="item.href"
        :to="item.href"
        :title="isCollapsed ? item.label : undefined"
        :class="[
          'flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200',
          isActive(item.href)
            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-900/25'
            : 'hover:bg-white/8 hover:text-white',
          isCollapsed ? 'justify-center px-0' : '',
        ]"
        @click="isMobileOpen = false"
      >
        <component 
          :is="item.icon" 
          :class="['h-5 w-5 flex-shrink-0', isActive(item.href) ? 'text-white' : 'text-slate-400']" 
        />
        <span v-if="!isCollapsed" class="text-sm">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div :class="['border-t border-slate-800 p-4 bg-white/5', isCollapsed ? 'px-2' : '']">
      <div v-if="!isCollapsed" class="mb-4 flex items-center gap-3 px-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
          <User class="h-5 w-5 text-slate-300" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-white">{{ userName }}</p>
          <p class="text-xs capitalize text-slate-500">{{ role }}</p>
        </div>
      </div>

      <RouterLink
        to="/connexion"
        :title="isCollapsed ? 'Deconnexion' : undefined"
        :class="[
          'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400',
          isCollapsed ? 'justify-center' : '',
        ]"
      >
        <LogOut class="h-5 w-5" />
        <span v-if="!isCollapsed" class="text-sm font-medium">Déconnexion</span>
      </RouterLink>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
</style>