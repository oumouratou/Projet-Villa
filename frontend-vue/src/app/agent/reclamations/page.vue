<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search, Eye, MessageSquare, AlertCircle, CheckCircle2, Clock } from 'lucide-vue-next'
import { getList } from '@/lib/api'

const complaints = ref<any[]>([])

const searchTerm = ref('')
const statusFilter = ref('all')

const filteredComplaints = computed(() => {
  return complaints.value.filter((complaint) => {
    const matchesSearch = complaint.subject.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || complaint.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

onMounted(async () => {
  complaints.value = await getList('/complaints')
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Gestion des reclamations</h1>
      <p class="mt-1 text-muted-foreground">Traitez les reclamations des clients</p>
    </div>

    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article class="rounded-xl border border-border bg-card p-5"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Total</p><MessageSquare class="h-5 w-5" /></div><p class="text-2xl font-bold">{{ complaints.length }}</p></article>
      <article class="rounded-xl border border-border bg-card p-5"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Ouvertes</p><AlertCircle class="h-5 w-5 text-red-600" /></div><p class="text-2xl font-bold text-red-600">{{ complaints.filter((c) => c.status === 'ouverte').length }}</p></article>
      <article class="rounded-xl border border-border bg-card p-5"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">En cours</p><Clock class="h-5 w-5 text-orange-600" /></div><p class="text-2xl font-bold text-orange-600">{{ complaints.filter((c) => c.status === 'en_cours').length }}</p></article>
      <article class="rounded-xl border border-border bg-card p-5"><div class="flex items-center justify-between"><p class="text-sm text-muted-foreground">Traitees</p><CheckCircle2 class="h-5 w-5 text-green-600" /></div><p class="text-2xl font-bold text-green-600">{{ complaints.filter((c) => c.status === 'traitee').length }}</p></article>
    </section>

    <div class="rounded-xl border border-border bg-card p-4">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input v-model="searchTerm" placeholder="Rechercher par sujet..." class="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3" />
        </div>
        <select v-model="statusFilter" class="rounded-lg border border-input bg-background px-3 py-2">
          <option value="all">Tous les statuts</option>
          <option value="ouverte">Ouverte</option>
          <option value="en_cours">En cours</option>
          <option value="traitee">Traitee</option>
        </select>
      </div>
    </div>

    <div class="rounded-xl border border-border bg-card p-5">
      <h2 class="mb-4 flex items-center gap-2 font-semibold">
        <MessageSquare class="h-5 w-5" />
        Liste des reclamations
      </h2>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-left text-muted-foreground">
              <th class="px-3 py-2">Sujet</th>
              <th class="px-3 py-2">Description</th>
              <th class="px-3 py-2">Date</th>
              <th class="px-3 py-2">Statut</th>
              <th class="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="complaint in filteredComplaints"
              :key="complaint.id"
              class="border-b border-border/60 hover:bg-muted/40"
            >
              <td class="px-3 py-3 font-medium">{{ complaint.subject }}</td>
              <td class="px-3 py-3 text-muted-foreground">{{ complaint.description }}</td>
              <td class="px-3 py-3">{{ new Date(complaint.created_at || complaint.createdAt).toLocaleDateString('fr-FR') }}</td>
              <td class="px-3 py-3">
                <span class="rounded-full bg-slate-100 px-2 py-1 text-xs">{{ complaint.status }}</span>
              </td>
              <td class="px-3 py-3 text-right">
                <RouterLink :to="`/agent/reclamations/${complaint.id}`" class="inline-flex items-center gap-2 text-primary">
                  <Eye class="h-4 w-4" />
                  Traiter
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
