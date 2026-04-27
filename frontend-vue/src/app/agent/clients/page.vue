<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Search, Eye, Users, Mail, Phone, Calendar } from 'lucide-vue-next'
import { getList } from '@/lib/api'

const clients = ref<any[]>([])
const reservations = ref<any[]>([])

const searchTerm = ref('')

const filteredClients = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return clients.value.filter((client) => {
    const fullName = `${client.first_name ?? client.firstName} ${client.last_name ?? client.lastName}`.toLowerCase()
    return (
      fullName.includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.includes(searchTerm.value)
    )
  })
})

const getClientReservationsCount = (clientId: string) =>
  reservations.value.filter((reservation) => String(reservation.client_id || reservation.clientId) === String(clientId)).length

onMounted(async () => {
  clients.value = await getList('/clients')
  reservations.value = await getList('/reservations')
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Gestion des clients</h1>
      <p class="mt-1 text-muted-foreground">
        {{ clients.length }} clients inscrits sur la plateforme
      </p>
    </div>

    <section class="grid gap-4 sm:grid-cols-3">
      <article class="rounded-xl border border-border bg-card p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Users class="h-6 w-6 text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ clients.length }}</p>
            <p class="text-sm text-muted-foreground">Clients total</p>
          </div>
        </div>
      </article>

      <article class="rounded-xl border border-border bg-card p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <Calendar class="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ reservations.length }}</p>
            <p class="text-sm text-muted-foreground">Reservations totales</p>
          </div>
        </div>
      </article>

      <article class="rounded-xl border border-border bg-card p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
            <Users class="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p class="text-2xl font-bold">
              {{ clients.filter((c) => reservations.some((r) => String(r.client_id || r.clientId) === String(c.id))).length }}
            </p>
            <p class="text-sm text-muted-foreground">Clients actifs</p>
          </div>
        </div>
      </article>
    </section>

    <div class="rounded-xl border border-border bg-card p-4">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchTerm"
          placeholder="Rechercher par nom, email ou telephone..."
          class="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3"
        />
      </div>
    </div>

    <div class="rounded-xl border border-border bg-card p-5">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-left text-muted-foreground">
              <th class="px-3 py-2">Client</th>
              <th class="px-3 py-2">Contact</th>
              <th class="px-3 py-2">Inscrit le</th>
              <th class="px-3 py-2">Reservations</th>
              <th class="px-3 py-2">Statut</th>
              <th class="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="client in filteredClients"
              :key="client.id"
              class="border-b border-border/60 hover:bg-muted/40"
            >
              <td class="px-3 py-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {{ (client.first_name ?? client.firstName)[0] }}{{ (client.last_name ?? client.lastName)[0] }}
                  </div>
                  <p class="font-medium">{{ client.first_name ?? client.firstName }} {{ client.last_name ?? client.lastName }}</p>
                </div>
              </td>
              <td class="px-3 py-3">
                <p class="flex items-center gap-2"><Mail class="h-3 w-3 text-muted-foreground" />{{ client.email }}</p>
                <p class="flex items-center gap-2 text-muted-foreground"><Phone class="h-3 w-3" />{{ client.phone }}</p>
              </td>
              <td class="px-3 py-3">{{ new Date(client.created_at || client.createdAt).toLocaleDateString('fr-FR') }}</td>
              <td class="px-3 py-3">
                <span class="rounded bg-secondary px-2 py-1 text-xs">
                  {{ getClientReservationsCount(client.id) }} reservation(s)
                </span>
              </td>
              <td class="px-3 py-3">
                <span
                  :class="[
                    'rounded-full px-2 py-1 text-xs',
                    client.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600',
                  ]"
                >
                  {{ client.status }}
                </span>
              </td>
              <td class="px-3 py-3 text-right">
                <RouterLink :to="`/agent/clients/${client.id}`" class="inline-flex items-center gap-2 text-primary">
                  <Eye class="h-4 w-4" />
                  Voir
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
