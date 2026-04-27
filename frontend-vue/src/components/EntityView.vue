<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDetail, getList } from '../lib/api'
import PageShell from './PageShell.vue'
import type { RowData } from '../types'

const props = defineProps<{
  title: string
  endpoint: string
  description?: string
  mode?: 'list' | 'detail' | 'form'
}>()

const route = useRoute()
const loading = ref(true)
const error = ref<string | null>(null)
const rows = ref<RowData[]>([])
const detailRow = ref<RowData | null>(null)

const currentId = computed(() => route.params.id?.toString() ?? null)
const titleText = computed(() => props.title)
const visibleRows = computed(() => {
  if (props.mode === 'detail') {
    return detailRow.value ? [detailRow.value] : []
  }

  return rows.value
})

const prettyKey = (key: string) => key.replaceAll('_', ' ')

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '-'
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(item => formatValue(item)).join(', ') : '-'
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    return entries.map(([key, innerValue]) => `${prettyKey(key)}: ${formatValue(innerValue)}`).join(' | ')
  }

  return String(value)
}

onMounted(async () => {
  try {
    if (props.mode === 'detail' && currentId.value) {
      detailRow.value = await getDetail(props.endpoint, currentId.value)
    } else {
      rows.value = await getList(props.endpoint)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de chargement'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <PageShell :title="titleText" :subtitle="description">
    <p v-if="loading" class="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">Chargement...</p>
    <p v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</p>

    <div v-else-if="mode === 'form'" class="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_rgba(15,23,42,0.08)] lg:grid-cols-2">
      <label class="space-y-2 text-sm font-medium text-slate-700">
        Nom
        <input class="app-input" type="text" placeholder="Nom complet" />
      </label>
      <label class="space-y-2 text-sm font-medium text-slate-700">
        Email
        <input class="app-input" type="email" placeholder="email@exemple.com" />
      </label>
      <label class="space-y-2 text-sm font-medium text-slate-700 lg:col-span-2">
        Message
        <textarea class="app-input min-h-32" placeholder="Saisir les informations..."></textarea>
      </label>
      <div class="lg:col-span-2 flex flex-wrap gap-3">
        <button class="app-button-primary">Enregistrer</button>
        <button class="app-button-secondary">Annuler</button>
      </div>
    </div>

    <div v-else-if="mode === 'detail'" class="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_rgba(15,23,42,0.08)]">
      <article v-for="row in visibleRows" :key="String(row.id)" class="space-y-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Détail base de données</p>
            <h2 class="mt-1 text-2xl font-black text-slate-950">Enregistrement #{{ row.id }}</h2>
          </div>
          <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">API Laravel</span>
        </div>
        <dl class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="(value, key) in row" :key="String(key)" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <dt class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{{ prettyKey(String(key)) }}</dt>
            <dd class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{{ formatValue(value) }}</dd>
          </div>
        </dl>
      </article>

      <p v-if="visibleRows.length === 0" class="text-sm text-slate-500">Aucune donnée correspondante.</p>
    </div>

    <div v-else class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.08)]">
      <table class="w-full border-collapse text-sm">
        <thead class="bg-slate-100/80 text-left text-slate-700">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">Données</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in visibleRows" :key="String(row.id ?? Math.random())" class="border-t border-slate-100 align-top">
            <td class="px-4 py-3 font-semibold text-slate-900">{{ row.id ?? '-' }}</td>
            <td class="px-4 py-3 text-slate-700">
              <div class="space-y-1">
                <div v-for="(value, key) in row" :key="String(key)" class="flex flex-wrap gap-2">
                  <span class="min-w-32 text-xs font-semibold uppercase tracking-wide text-slate-500">{{ key }}</span>
                  <span class="text-xs text-slate-800">{{ formatValue(value) }}</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PageShell>
</template>
