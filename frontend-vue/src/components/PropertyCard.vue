<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight, BedDouble, Bath, MapPin, SquareStack, ShieldCheck } from 'lucide-vue-next'
defineProps<{ property: any }>()

const primaryImage = (images: string[]) => images[0] || '/placeholder.svg'
</script>

<template>
  <article class="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
    <div class="relative overflow-hidden">
      <img
        :src="primaryImage(property.images)"
        :alt="property.title"
        class="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent"></div>
      <div class="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
        <span class="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 backdrop-blur">
          {{ property.type }}
        </span>
        <span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 backdrop-blur">
          <ShieldCheck class="h-3.5 w-3.5" />
          Vérifié
        </span>
      </div>
      <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
        <div class="max-w-[70%]">
          <h3 class="text-xl font-bold leading-tight text-balance">{{ property.title }}</h3>
          <div class="mt-2 flex items-center gap-1.5 text-sm text-white/80">
            <MapPin class="h-4 w-4" />
            <span>{{ property.city }} • {{ property.address }}</span>
          </div>
        </div>
        <span class="rounded-2xl bg-white/15 px-3 py-2 text-right text-xs font-medium backdrop-blur">
          <span class="block text-[0.65rem] uppercase tracking-[0.22em] text-white/70">Prix / nuit</span>
          <span class="block text-base font-bold">{{ property.pricePerNight.toLocaleString('fr-FR') }} FCFA</span>
        </span>
      </div>
    </div>

    <div class="space-y-4 p-5">
      <p class="line-clamp-2 text-sm leading-6 text-slate-600">{{ property.description }}</p>

      <div class="grid grid-cols-3 gap-3 text-xs font-medium text-slate-600">
        <div class="rounded-2xl bg-slate-50 px-3 py-2 text-center">
          <SquareStack class="mx-auto mb-1 h-4 w-4 text-sky-600" />
          {{ property.surface }} m²
        </div>
        <div class="rounded-2xl bg-slate-50 px-3 py-2 text-center">
          <BedDouble class="mx-auto mb-1 h-4 w-4 text-sky-600" />
          {{ property.bedrooms }} chambres
        </div>
        <div class="rounded-2xl bg-slate-50 px-3 py-2 text-center">
          <Bath class="mx-auto mb-1 h-4 w-4 text-sky-600" />
          {{ property.bathrooms }} bain
        </div>
      </div>

      <div class="flex items-center justify-between gap-3">
        <span class="text-sm font-semibold text-slate-900">{{ property.images.length }} image(s) disponible(s)</span>
        <RouterLink
          :to="`/biens/${property.id}`"
          class="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Voir détails
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
    </div>
  </article>
</template>
