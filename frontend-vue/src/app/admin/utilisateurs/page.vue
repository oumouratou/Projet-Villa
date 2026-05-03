<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Plus, Search, Edit2, Trash2, Save, X, UserCog, Shield,
  Mail, Phone, CheckCircle2, AlertCircle, Eye, EyeOff
} from 'lucide-vue-next'
import { getStoredToken, getStoredUser } from '@/lib/session'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

const ALLOWED_ADMINS = [
  'mlamaranapalaga21@gmail.com',
  'oumouratoubarry52@gmail.com'
]

const users       = ref<any[]>([])
const loading     = ref(true)
const searchTerm  = ref('')
const roleFilter  = ref('all')
const showForm    = ref(false)
const editingId   = ref<string | null>(null)
const saving      = ref(false)
const deleting    = ref<string | null>(null)
const showPass    = ref(false)
const toast       = ref<{ msg: string; type: 'ok' | 'err' } | null>(null)

const currentUser = computed(() => getStoredUser() as any)
const isAllowed   = computed(() => ALLOWED_ADMINS.includes(currentUser.value?.email ?? ''))

const form = reactive({
  first_name: '', last_name: '', email: '',
  phone: '', password: '', role: 'agent', status: 'actif'
})

const filtered = computed(() =>
  users.value.filter(u => {
    const name = (u.name ?? `${u.first_name ?? ''} ${u.last_name ?? ''}`).toLowerCase()
    const matchSearch = name.includes(searchTerm.value.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchRole = roleFilter.value === 'all' || u.role === roleFilter.value
    return matchSearch && matchRole
  })
)

const agentCount  = computed(() => users.value.filter(u => u.role === 'agent').length)
const adminCount  = computed(() => users.value.filter(u => u.role === 'admin').length)
const activeCount = computed(() => users.value.filter(u => u.status === 'actif').length)

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getStoredToken()}`,
})

const showToast = (msg: string, type: 'ok' | 'err') => {
  toast.value = { msg, type }
  setTimeout(() => { toast.value = null }, 3500)
}

const load = async () => {
  loading.value = true
  try {
    const res  = await fetch(`${API_BASE}/users`, { headers: authHeaders() })
    const json = await res.json()
    users.value = Array.isArray(json.data) ? json.data : []
  } catch { users.value = [] }
  finally { loading.value = false }
}

const openCreate = () => {
  if (!isAllowed.value) { showToast('Accès refusé', 'err'); return }
  editingId.value = null
  Object.assign(form, { first_name: '', last_name: '', email: '', phone: '', password: '', role: 'agent', status: 'actif' })
  showForm.value = true
}

const openEdit = (u: any) => {
  if (!isAllowed.value) { showToast('Accès refusé', 'err'); return }
  editingId.value = String(u.id)
  Object.assign(form, {
    first_name: u.first_name ?? '',
    last_name:  u.last_name ?? '',
    email:      u.email ?? '',
    phone:      u.phone ?? '',
    password:   '',
    role:       u.role ?? 'agent',
    status:     u.status ?? 'actif'
  })
  showForm.value = true
}

const cancelForm = () => { showForm.value = false; editingId.value = null }

const saveUser = async () => {
  if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
    showToast('Prénom, nom et email sont requis', 'err'); return
  }
  if (!editingId.value && !form.password) {
    showToast('Mot de passe requis pour un nouveau compte', 'err'); return
  }
  saving.value = true
  try {
    const body: any = {
      first_name: form.first_name.trim(),
      last_name:  form.last_name.trim(),
      email:      form.email.trim(),
      phone:      form.phone || null,
      role:       form.role,
      status:     form.status,
    }
    if (form.password) body.password = form.password

    const url    = editingId.value ? `${API_BASE}/users/${editingId.value}` : `${API_BASE}/users`
    const method = editingId.value ? 'PUT' : 'POST'
    const res    = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) })
    const json   = await res.json()
    if (!res.ok) throw new Error(json.message ?? 'Erreur')

    const saved = json.data
    if (editingId.value) {
      const idx = users.value.findIndex(u => String(u.id) === editingId.value)
      if (idx !== -1) users.value[idx] = saved
    } else {
      users.value.unshift(saved)
    }
    showToast(editingId.value ? 'Agent modifié ✅' : 'Agent créé et enregistré en base ✅', 'ok')
    cancelForm()
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Erreur', 'err')
  } finally { saving.value = false }
}

const deleteUser = async (id: string, email: string) => {
  if (ALLOWED_ADMINS.includes(email)) {
    showToast('Impossible de supprimer un administrateur principal', 'err'); return
  }
  if (!confirm('Supprimer cet utilisateur définitivement ?')) return
  deleting.value = id
  try {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE', headers: authHeaders()
    })
    if (!res.ok) throw new Error('Erreur lors de la suppression')
    users.value = users.value.filter(u => String(u.id) !== id)
    showToast('Utilisateur supprimé', 'ok')
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Erreur', 'err')
  } finally { deleting.value = null }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6 p-6">

    <transition name="fade">
      <div v-if="toast"
        class="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-xl font-semibold text-sm"
        :class="toast.type === 'ok'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'">
        <CheckCircle2 v-if="toast.type === 'ok'" class="h-5 w-5" />
        <AlertCircle v-else class="h-5 w-5" />
        {{ toast.msg }}
      </div>
    </transition>

    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-foreground">Gestion des utilisateurs</h1>
        <p class="mt-1 text-muted-foreground">Agents et administrateurs de la plateforme</p>
      </div>
      <button v-if="isAllowed" @click="openCreate"
        class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
        <Plus class="h-5 w-5" />Ajouter un agent
      </button>
      <div v-else
        class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
        ⚠️ Seuls les 2 administrateurs principaux peuvent gérer les agents
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <UserCog class="h-8 w-8 text-sky-500" />
        <div><p class="text-2xl font-black">{{ users.length }}</p><p class="text-xs text-muted-foreground">Total</p></div>
      </div>
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <Shield class="h-8 w-8 text-purple-500" />
        <div><p class="text-2xl font-black text-purple-600">{{ adminCount }}</p><p class="text-xs text-muted-foreground">Admins</p></div>
      </div>
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <UserCog class="h-8 w-8 text-blue-500" />
        <div><p class="text-2xl font-black text-blue-600">{{ agentCount }}</p><p class="text-xs text-muted-foreground">Agents</p></div>
      </div>
      <div class="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <CheckCircle2 class="h-8 w-8 text-emerald-500" />
        <div><p class="text-2xl font-black text-emerald-600">{{ activeCount }}</p><p class="text-xs text-muted-foreground">Actifs</p></div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showForm"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between border-b border-border p-5">
            <h2 class="font-bold text-foreground text-lg">
              {{ editingId ? 'Modifier' : 'Nouvel' }} agent
            </h2>
            <button @click="cancelForm" class="rounded-full p-1 hover:bg-muted transition-colors">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Prénom *</label>
                <input v-model="form.first_name" placeholder="Prénom"
                  class="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Nom *</label>
                <input v-model="form.last_name" placeholder="Nom"
                  class="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Email *</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input v-model="form.email" type="email" placeholder="email@exemple.com"
                  :disabled="!!editingId"
                  class="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60" />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Téléphone</label>
              <div class="relative">
                <Phone class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input v-model="form.phone" placeholder="+225 XX XX XX XX XX"
                  class="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Rôle</label>
                <select v-model="form.role"
                  class="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none">
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Statut</label>
                <select v-model="form.status"
                  class="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none">
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Mot de passe {{ editingId ? '(laisser vide pour conserver)' : '*' }}
              </label>
              <div class="relative">
                <input :type="showPass ? 'text' : 'password'" v-model="form.password"
                  placeholder="Min. 8 caractères"
                  class="w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-12 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <button type="button" @click="showPass = !showPass"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <EyeOff v-if="showPass" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex gap-3 border-t border-border p-5">
            <button @click="cancelForm"
              class="flex-1 rounded-xl border border-input py-2.5 text-sm font-semibold hover:bg-muted transition-colors">
              Annuler
            </button>
            <button @click="saveUser" :disabled="saving"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
              <Save class="h-4 w-4" />{{ saving ? 'Sauvegarde...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="flex flex-col gap-3 sm:flex-row rounded-xl border border-border bg-card p-4">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input v-model="searchTerm" placeholder="Rechercher par nom ou email..."
          class="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>
      <select v-model="roleFilter"
        class="rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <option value="all">Tous les rôles</option>
        <option value="admin">Admin</option>
        <option value="agent">Agent</option>
      </select>
    </div>

    <div class="rounded-xl border border-border bg-card overflow-hidden">
      <div class="border-b border-border p-5">
        <h2 class="font-semibold flex items-center gap-2">
          <UserCog class="h-5 w-5 text-primary" />{{ filtered.length }} utilisateur(s)
        </h2>
      </div>

      <div v-if="loading" class="p-6 space-y-3">
        <div v-for="i in 4" :key="i" class="h-16 animate-pulse rounded-xl bg-muted" />
      </div>

      <div v-else-if="filtered.length === 0" class="p-12 text-center">
        <UserCog class="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
        <p class="text-muted-foreground">Aucun utilisateur trouvé</p>
      </div>

      <div v-else class="divide-y divide-border">
        <div v-for="u in filtered" :key="u.id"
          class="flex flex-col gap-3 p-4 hover:bg-muted/20 transition-colors sm:flex-row sm:items-center">
          <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-black text-lg"
            :class="u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
            {{ (u.name ?? u.first_name ?? '?').charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-foreground">
              {{ u.name ?? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() }}
            </p>
            <p class="text-sm text-muted-foreground flex items-center gap-1">
              <Mail class="h-3 w-3" />{{ u.email }}
            </p>
            <p v-if="u.phone" class="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Phone class="h-3 w-3" />{{ u.phone }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full px-3 py-1 text-xs font-bold"
              :class="u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
              {{ u.role === 'admin' ? '🛡️ Admin' : '👤 Agent' }}
            </span>
            <span class="rounded-full px-3 py-1 text-xs font-bold"
              :class="u.status === 'actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'">
              {{ u.status === 'actif' ? 'Actif' : 'Inactif' }}
            </span>
            <template v-if="isAllowed">
              <button @click="openEdit(u)"
                class="inline-flex items-center gap-1 rounded-lg border border-input px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
                <Edit2 class="h-3.5 w-3.5" />Modifier
              </button>
              <button v-if="!ALLOWED_ADMINS.includes(u.email)"
                @click="deleteUser(String(u.id), u.email)"
                :disabled="deleting === String(u.id)"
                class="inline-flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors">
                <Trash2 class="h-3.5 w-3.5" />Supprimer
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>