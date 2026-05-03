<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, BedDouble, Bath, MapPin, Maximize, LogIn, Calendar, Lock } from 'lucide-vue-next'
import { getStoredToken } from '@/lib/session'

const props = defineProps<{ property: any }>()

const isLoggedIn  = computed(() => Boolean(getStoredToken()))
const isAvailable = computed(() => props.property.status === 'disponible')

const loginUrl = computed(() => {
  const target = `/client/reservations/nouvelle?bien=${props.property.id}`
  return `/connexion?redirect=${encodeURIComponent(target)}`
})
const registerUrl = computed(() => {
  const target = `/client/reservations/nouvelle?bien=${props.property.id}`
  return `/inscription?redirect=${encodeURIComponent(target)}`
})
const reserveUrl = computed(() =>
  `/client/reservations/nouvelle?bien=${props.property.id}`
)

const primaryImage = (images: string[]) =>
  images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop'
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.14)]"
    :class="isAvailable ? 'border-slate-200/80' : 'border-slate-300/60'">

    <div class="relative overflow-hidden">
      <img :src="primaryImage(property.images)" :alt="property.title"
        class="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        :class="!isAvailable ? 'grayscale-[30%]' : ''" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
      <div v-if="!isAvailable" class="absolute inset-0 bg-slate-950/25" />

      <div class="absolute left-4 right-4 top-4 flex items-center justify-between">
        <span class="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 backdrop-blur">
          {{ property.type || 'Villa' }}
        </span>
        <span class="rounded-full px-3 py-1 text-xs font-bold backdrop-blur"
          :class="isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'">
          {{ isAvailable ? '✓ Disponible' : '🔒 Réservé' }}
        </span>
      </div>

      <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
        <div class="max-w-[65%]">
          <h3 class="text-lg font-bold leading-tight">{{ property.title }}</h3>
          <div class="mt-1 flex items-center gap-1.5 text-sm text-white/80">
            <MapPin class="h-3.5 w-3.5 flex-shrink-0" />
            <span class="truncate">{{ property.city }}</span>
          </div>
        </div>
        <div class="rounded-2xl bg-white/15 px-3 py-2 text-right backdrop-blur border border-white/10">
          <span class="block text-[0.6rem] uppercase tracking-widest text-white/70">/ nuit</span>
          <span class="block text-base font-black">
            {{ Number(property.pricePerNight ?? property.price_per_night ?? 0).toLocaleString('fr-FR') }} FCFA
          </span>
        </div>
      </div>
    </div>

    <div class="space-y-4 p-5">
      <p class="line-clamp-2 text-sm leading-6 text-slate-500">{{ property.description }}</p>

      <div class="grid grid-cols-3 gap-2 text-xs font-medium text-slate-600">
        <div class="flex flex-col items-center gap-1 rounded-2xl bg-slate-50 px-2 py-2.5">
          <Maximize class="h-4 w-4 text-sky-500" /><span>{{ property.surface }} m²</span>
        </div>
        <div class="flex flex-col items-center gap-1 rounded-2xl bg-slate-50 px-2 py-2.5">
          <BedDouble class="h-4 w-4 text-sky-500" /><span>{{ property.bedrooms }} ch.</span>
        </div>
        <div class="flex flex-col items-center gap-1 rounded-2xl bg-slate-50 px-2 py-2.5">
          <Bath class="h-4 w-4 text-sky-500" /><span>{{ property.bathrooms }} sdb</span>
        </div>
      </div>

      <div v-if="property.options?.length" class="flex flex-wrap gap-1.5">
        <span v-for="opt in property.options.slice(0, 3)" :key="opt.id"
          class="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
          {{ opt.name }}
        </span>
        <span v-if="property.options.length > 3"
          class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
          +{{ property.options.length - 3 }}
        </span>
      </div>

      <div class="flex items-center gap-2 pt-1">
        <RouterLink :to="`/biens/${property.id}`"
          class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          Voir détails <ArrowRight class="h-4 w-4" />
        </RouterLink>

        <!-- Réservé = bouton désactivé -->
        <div v-if="!isAvailable"
          class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed">
          <Lock class="h-4 w-4" />Réservé
        </div>

        <!-- Connecté = réserver -->
        <RouterLink v-else-if="isLoggedIn" :to="reserveUrl"
          class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-sky-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors">
          <Calendar class="h-4 w-4" />Réserver
        </RouterLink>

        <!-- Non connecté = connexion -->
        <RouterLink v-else :to="loginUrl"
          class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">
          <LogIn class="h-4 w-4" />Se connecter
        </RouterLink>
      </div>

      <p v-if="!isLoggedIn && isAvailable" class="text-center text-xs text-slate-400">
        Ou
        <RouterLink :to="registerUrl"
          class="font-semibold text-sky-500 underline underline-offset-2 hover:text-sky-600">
          créez un compte gratuitement
        </RouterLink>
        pour réserver
      </p>

      <p v-if="!isAvailable" class="text-center text-xs font-semibold text-red-500">
        🔒 Ce bien est actuellement réservé
      </p>
    </div>
  </article>
</template>