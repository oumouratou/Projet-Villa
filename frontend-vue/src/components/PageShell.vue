<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  title: string
  subtitle?: string
}>()

const shortcuts = [
  { to: '/admin', label: 'Admin' },
  { to: '/agent', label: 'Agent' },
  { to: '/client', label: 'Client' },
  { to: '/biens', label: 'Biens publics' },
]
</script>

<template>
  <section class="space-y-6">
    <header class="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_22px_50px_rgba(15,23,42,0.08)] backdrop-blur">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-sky-700">Immobilier connecté</p>
          <h1 class="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{{ title }}</h1>
          <p v-if="subtitle" class="max-w-3xl text-sm leading-6 text-slate-600">{{ subtitle }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <RouterLink
            v-for="shortcut in shortcuts"
            :key="shortcut.to"
            :to="shortcut.to"
            class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700"
          >
            {{ shortcut.label }}
          </RouterLink>
        </div>
      </div>
    </header>

    <slot />
  </section>
</template>
