<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import DashboardHeader from '@/components/DashboardHeader.vue'

const route = useRoute()

const section = computed<'admin' | 'agent' | 'client' | null>(() => {
  const path = route.path
  if (path.startsWith('/admin')) return 'admin'
  if (path.startsWith('/agent')) return 'agent'
  if (path.startsWith('/client')) return 'client'
  return null
})

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Tableau de bord Administrateur'
  if (path === '/agent') return 'Tableau de bord Agent'
  if (path === '/client') return 'Tableau de bord Client'
  if (path.includes('/biens')) return 'Gestion des biens'
  if (path.includes('/reservations')) return 'Reservations'
  if (path.includes('/reclamations')) return 'Reclamations'
  if (path.includes('/clients')) return 'Clients'
  if (path.includes('/utilisateurs')) return 'Utilisateurs'
  if (path.includes('/options')) return 'Options'
  return 'ImmoGestion'
})
</script>

<template>
  <div v-if="section" class="flex min-h-screen bg-background">
    <DashboardSidebar :role="section" />

    <div class="flex min-w-0 flex-1 flex-col">
      <DashboardHeader :title="pageTitle" />
      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>

  <RouterView v-else />
</template>
