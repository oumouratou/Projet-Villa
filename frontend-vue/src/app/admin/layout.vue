<template>
  <div class="flex min-h-screen bg-slate-50">
    <DashboardSidebar role="admin" />

    <div class="flex-1 flex flex-col">
      <DashboardHeader />

      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importation des composants de structure
import DashboardSidebar from "@/components/DashboardSidebar.vue"
import DashboardHeader from "@/components/DashboardHeader.vue"
</script>

<style scoped>
/* Ajoute ici des styles spécifiques au layout si nécessaire */
</style>