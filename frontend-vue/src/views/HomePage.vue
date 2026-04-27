<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getList } from '../lib/api'
import type { RowData } from '../types'

const featuredProperties = ref<RowData[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const properties = await getList('/properties')
    featuredProperties.value = properties
      .filter((property) => String(property.status) === 'disponible')
      .slice(0, 3)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-12">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-6 py-12 text-white lg:px-10 lg:py-16">
      <div class="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div class="space-y-5">
          <h1 class="text-3xl font-bold leading-tight sm:text-4xl">Trouvez votre location ideale avec ImmoGestion</h1>
          <p class="text-sm text-slate-200 sm:text-base">
            Decouvrez notre selection de biens immobiliers de qualite. Appartements, maisons et villas sont relies au backend Laravel.
          </p>
          <div class="flex flex-wrap gap-3">
            <RouterLink to="/biens" class="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400">
              Voir nos biens
            </RouterLink>
            <RouterLink to="/inscription" class="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
              Creer un compte
            </RouterLink>
          </div>
        </div>

        <form class="grid gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
          <label class="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
            Ville
            <input class="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300" type="text" placeholder="Ville ou code postal" />
          </label>
          <label class="grid gap-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
            Budget max
            <select class="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none">
              <option class="text-slate-900" value="">Budget max</option>
              <option class="text-slate-900" value="50000">50 000 FCFA</option>
              <option class="text-slate-900" value="100000">100 000 FCFA</option>
              <option class="text-slate-900" value="200000">200 000 FCFA</option>
              <option class="text-slate-900" value="300000">300 000 FCFA</option>
            </select>
          </label>
          <button type="button" class="mt-1 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-400">Rechercher</button>
        </form>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-900">Biens en vedette</h2>
        <RouterLink to="/biens" class="text-sm font-semibold text-cyan-700 hover:text-cyan-800">Voir tous les biens</RouterLink>
      </div>

      <p v-if="loading" class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Chargement des biens...</p>
      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="property in featuredProperties" :key="String(property.id)" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-cyan-700">{{ property.type || 'bien' }}</p>
          <h3 class="mt-1 text-lg font-semibold text-slate-900">{{ property.title }}</h3>
          <p class="mt-1 text-sm text-slate-600">{{ property.city }} • {{ property.address }}</p>
          <p class="mt-3 text-sm font-semibold text-slate-900">{{ Number(property.price_per_night || 0).toLocaleString('fr-FR') }} FCFA / nuit</p>
          <RouterLink :to="`/biens/${property.id}`" class="mt-4 inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-800">Voir le detail</RouterLink>
        </article>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 class="font-semibold text-slate-900">Biens de qualite</h3>
        <p class="mt-2 text-sm text-slate-600">Selection rigoureuse de biens verifies et entretenus.</p>
      </article>
      <article class="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 class="font-semibold text-slate-900">Securite garantie</h3>
        <p class="mt-2 text-sm text-slate-600">Transactions securisees et gestion centralisee.</p>
      </article>
      <article class="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 class="font-semibold text-slate-900">Reactivite</h3>
        <p class="mt-2 text-sm text-slate-600">Suivi rapide des reservations et reclamations.</p>
      </article>
      <article class="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 class="font-semibold text-slate-900">Accompagnement</h3>
        <p class="mt-2 text-sm text-slate-600">Equipe dediee aux clients, agents et administrateurs.</p>
      </article>
    </section>

    <section class="rounded-3xl bg-cyan-700 px-6 py-10 text-white">
      <h2 class="text-2xl font-bold">Pret a trouver votre prochain logement ?</h2>
      <p class="mt-2 text-sm text-cyan-100">Creez votre compte gratuitement et suivez vos demandes en temps reel.</p>
      <div class="mt-5 flex flex-wrap gap-3">
        <RouterLink to="/inscription" class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-slate-100">Creer mon compte</RouterLink>
        <RouterLink to="/biens" class="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">Parcourir les biens</RouterLink>
      </div>
    </section>
  </div>
</template>
