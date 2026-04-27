<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bell, Search } from 'lucide-vue-next'

const props = defineProps<{ title?: string; subtitle?: string }>()
const showNotifications = ref(false)

const notifications = [
  { id: 1, message: 'Nouvelle reservation recue', time: 'Il y a 5 min', unread: true },
  { id: 2, message: 'Votre reclamation a ete traitee', time: 'Il y a 2h', unread: true },
  { id: 3, message: 'Paiement confirme', time: 'Hier', unread: false },
]

const unreadCount = computed(() => notifications.filter((item) => item.unread).length)
</script>

<template>
  <header class="border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur">
    <div class="flex items-center justify-between gap-4">
      <div class="min-w-0 flex-1">
        <h1 class="truncate text-xl font-bold text-foreground lg:text-2xl">{{ title || 'Tableau de bord' }}</h1>
        <p v-if="subtitle" class="mt-0.5 text-sm text-muted-foreground">{{ subtitle }}</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative hidden md:block">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Rechercher..." class="app-input w-64 py-2 pl-9 pr-4 text-sm" />
        </div>

        <div class="relative">
          <button class="relative rounded-full border border-slate-200 bg-white p-2.5 transition-colors hover:border-sky-300 hover:bg-sky-50" aria-label="Notifications" @click="showNotifications = !showNotifications">
            <Bell class="h-5 w-5 text-muted-foreground" />
            <span v-if="unreadCount > 0" class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {{ unreadCount }}
            </span>
          </button>

          <div v-if="showNotifications" class="fixed inset-0 z-40" @click="showNotifications = false" />

          <div v-if="showNotifications" class="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.12)]">
            <div class="border-b border-border px-4 py-3">
              <h3 class="font-semibold text-foreground">Notifications</h3>
            </div>
            <div class="max-h-80 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                :class="[
                  'border-b border-border px-4 py-3 transition-colors hover:bg-muted/50 last:border-0',
                  notification.unread ? 'bg-muted/30' : '',
                ]"
              >
                <p class="text-sm text-foreground">{{ notification.message }}</p>
                <p class="mt-1 text-xs text-muted-foreground">{{ notification.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
