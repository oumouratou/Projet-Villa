<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Wifi,
  Car,
  Waves,
  Wind,
  Tv,
  UtensilsCrossed,
} from 'lucide-vue-next'
import { mockOptions } from '@/lib/mock-data'

const searchTerm = ref('')

const filteredOptions = computed(() =>
  mockOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  ),
)

const iconMap: Record<string, any> = {
  wifi: Wifi,
  car: Car,
  waves: Waves,
  wind: Wind,
  tv: Tv,
  utensils: UtensilsCrossed,
}
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Gestion des options</h1>
        <p class="mt-1 text-muted-foreground">
          Gerez les equipements et options des biens
        </p>
      </div>
      <button class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground">
        <Plus class="h-4 w-4" />
        Ajouter une option
      </button>
    </div>

    <div class="rounded-xl border border-border bg-card p-4">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchTerm"
          placeholder="Rechercher une option..."
          class="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3"
        />
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="option in filteredOptions"
        :key="option.id"
        class="rounded-xl border border-border bg-card p-5"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <component :is="iconMap[option.icon] || Wifi" class="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold">{{ option.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ option.description }}</p>
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span class="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
            Utilise dans 2 biens
          </span>
          <div class="flex items-center gap-2">
            <button class="rounded p-1.5 hover:bg-muted">
              <Edit class="h-4 w-4" />
            </button>
            <button class="rounded p-1.5 text-red-600 hover:bg-red-50">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
