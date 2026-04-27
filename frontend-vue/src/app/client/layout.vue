<script setup>
import DashboardSidebar from "@/components/DashboardSidebar.vue"
</script>

<template>
  <div class="min-h-screen flex bg-background">
    <DashboardSidebar role="client" userName="Sophie Leroy" />

    <div class="flex-1 flex flex-col min-w-0 lg:ml-0">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
/* Tes styles CSS si nécessaire */
</style>