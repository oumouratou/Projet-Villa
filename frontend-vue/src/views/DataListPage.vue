<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getList } from '../lib/api'
import type { RowData } from '../types'

const props = defineProps<{
  title: string
  endpoint: string
}>()

const route = useRoute()
const loading = ref(true)
const error = ref<string | null>(null)
const rows = ref<RowData[]>([])

const visibleRows = computed(() => {
  if (route.params.id) {
    const id = Number(route.params.id)
    return rows.value.filter((r) => Number(r.id) === id)
  }
  return rows.value
})

onMounted(async () => {
  try {
    rows.value = await getList(props.endpoint)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de chargement'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="space-y-4">
    <h1 class="text-3xl font-semibold tracking-tight">{{ title }}</h1>

    <p v-if="loading" class="text-sm text-slate-500">Chargement...</p>
    <p v-else-if="error" class="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">{{ error }}</p>

    <div v-else class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table class="w-full table-auto border-collapse text-sm">
        <thead class="bg-slate-100 text-left text-slate-700">
          <tr>
            <th class="px-3 py-2">id</th>
            <th class="px-3 py-2">donnees</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in visibleRows" :key="String(row.id ?? Math.random())" class="border-t border-slate-100 align-top">
            <td class="px-3 py-2 font-medium text-slate-900">{{ row.id ?? '-' }}</td>
            <td class="px-3 py-2 text-slate-700">
              <pre class="max-w-[90vw] overflow-auto whitespace-pre-wrap text-xs">{{ row }}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
