<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Building2, Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)
const route = useRoute()

const isActive = (path: string) => route.path === path || route.path.startsWith(`${path}/`)

const linkClass = (path: string) => [
  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
  isActive(path) ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
]

const mobileLinkClass = (path: string) => [
  'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
  isActive(path) ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
]

const navItems = computed(() => [
  { label: 'Accueil', path: '/' },
  { label: 'Nos Biens', path: '/biens' },
])
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
            <Building2 class="h-5 w-5" />
          </span>
          <div>
            <span class="block text-xl font-black tracking-tight text-slate-950">ImmoGestion</span>
            <span class="block text-xs font-medium text-slate-500">Villas premium & gestion locative</span>
          </div>
        </RouterLink>

        <nav class="hidden items-center gap-2 md:flex">
          <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" :class="linkClass(item.path)">
            {{ item.label }}
          </RouterLink>
        </nav>

        <div class="hidden items-center gap-4 md:flex">
          <RouterLink to="/connexion" class="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950">Connexion</RouterLink>
          <RouterLink to="/inscription" class="rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:-translate-y-0.5">
            Inscription
          </RouterLink>
        </div>

        <button class="rounded-full border border-slate-200 bg-white p-2 shadow-sm md:hidden" aria-label="Toggle menu" @click="isMenuOpen = !isMenuOpen">
          <X v-if="isMenuOpen" class="h-6 w-6" />
          <Menu v-else class="h-6 w-6" />
        </button>
      </div>

      <div v-if="isMenuOpen" class="border-t border-slate-200 py-4 md:hidden">
        <nav class="flex flex-col gap-3">
          <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" :class="mobileLinkClass(item.path)">
            {{ item.label }}
          </RouterLink>
          <RouterLink to="/connexion" class="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
            Connexion
          </RouterLink>
          <RouterLink to="/inscription" class="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-slate-900/15">
            Inscription
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>
