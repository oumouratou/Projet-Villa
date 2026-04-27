<script setup lang="ts">
import EntityView from '../components/EntityView.vue'

defineProps<{
  title: string
  endpoint: string
  description?: string
  mode?: 'list' | 'detail' | 'form'
}>()
</script>

<template>
  <EntityView v-bind="$props" />
</template>
