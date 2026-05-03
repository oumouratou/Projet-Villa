<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-vue-next'
import { loginUser } from '@/lib/api'
import { getUserRole } from '@/lib/session'

const router = useRouter()
const route  = useRoute()

const showPassword = ref(false)
const isLoading    = ref(false)
const error        = ref('')
const form = reactive({ email: '', password: '' })

const handleSubmit = async () => {
  error.value     = ''
  isLoading.value = true
  try {
    const result = await loginUser(form.email, form.password)
    const user   = result.user as Record<string, unknown>
    const role   = getUserRole(user) ?? (user?.role as string) ?? 'client'
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''

    // Redirect URL seulement si compatible avec le rôle
    if (redirect.startsWith('/')) {
      const isClientPath = redirect.startsWith('/client')
      const isAgentPath  = redirect.startsWith('/agent')
      const isAdminPath  = redirect.startsWith('/admin')
      const canAccess =
        (isClientPath && role === 'client') ||
        (isAgentPath  && (role === 'agent' || role === 'admin')) ||
        (isAdminPath  && role === 'admin') ||
        (!isClientPath && !isAgentPath && !isAdminPath)
      if (canAccess) {
        await router.push(redirect)
        return
      }
    }

    if (role === 'admin')      await router.push('/admin')
    else if (role === 'agent') await router.push('/agent')
    else                       await router.push('/client')

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Email ou mot de passe incorrect.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 antialiased text-slate-900">

    <div class="hidden lg:flex lg:w-1/2 bg-[#0f172a] relative overflow-hidden">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-sky-500 opacity-20 blur-[120px] rounded-full" />
      <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-sky-500/10 to-transparent" />
      <div class="relative z-10 flex flex-col justify-center p-16 w-full">
        <div class="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-8 w-fit border border-white/10">
          <Building2 class="h-10 w-10 text-sky-400" />
        </div>
        <h2 class="text-5xl font-extrabold text-white mb-4 leading-tight">
          ImmoGestion<br /><span class="text-sky-400">Premium.</span>
        </h2>
        <p class="text-slate-400 text-lg max-w-sm leading-relaxed">
          La plateforme complète pour gérer vos locations immobilières.
        </p>
        <div class="mt-10 space-y-4">
          <div v-for="text in [
            'Gestion des biens en temps réel',
            'Réservations avec notifications',
            'Suivi des réclamations clients'
          ]" :key="text" class="flex items-center gap-3 text-slate-300">
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold">✓</div>
            {{ text }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col justify-center items-center py-12 px-6">
      <div class="w-full max-w-md">

        <div class="lg:hidden flex justify-center mb-8">
          <div class="flex items-center gap-2">
            <Building2 class="h-8 w-8 text-sky-500" />
            <span class="text-2xl font-bold text-slate-950">ImmoGestion</span>
          </div>
        </div>

        <div class="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div class="p-8 lg:p-10">
            <h1 class="text-2xl font-black text-slate-950">Connexion</h1>
            <p class="text-slate-500 text-sm mt-1">Ravi de vous revoir !</p>

            <div v-if="error"
              class="mt-5 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg font-medium">
              {{ error }}
            </div>

            <form @submit.prevent="handleSubmit" class="mt-6 space-y-5">
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Adresse email</label>
                <div class="relative group">
                  <Mail class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  <input v-model="form.email" type="email" required autocomplete="email"
                    placeholder="votre@email.com"
                    class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 transition-all focus:bg-white focus:ring-4 focus:ring-sky-50 focus:border-sky-500 outline-none" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Mot de passe</label>
                <div class="relative group">
                  <Lock class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                    required autocomplete="current-password" placeholder="••••••••"
                    class="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 transition-all focus:bg-white focus:ring-4 focus:ring-sky-50 focus:border-sky-500 outline-none" />
                  <button type="button" @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    <EyeOff v-if="showPassword" class="h-5 w-5" />
                    <Eye v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 rounded border-slate-300 text-sky-500" />
                  <span class="text-sm text-slate-500">Se souvenir</span>
                </label>
                <RouterLink to="/mot-de-passe-oublie"
                  class="text-sm font-semibold text-sky-500 hover:text-sky-600">
                  Mot de passe oublié ?
                </RouterLink>
              </div>

              <button type="submit" :disabled="isLoading"
                class="w-full py-4 bg-sky-500 text-white rounded-2xl font-bold text-lg hover:bg-sky-600 active:scale-[0.98] transition-all shadow-xl shadow-sky-200/60 flex items-center justify-center gap-3 disabled:opacity-70">
                <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <template v-else>Se connecter <ArrowRight class="h-5 w-5" /></template>
              </button>
            </form>
          </div>

          <div class="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
            <p class="text-sm text-slate-500">
              Pas encore de compte ?
              <RouterLink to="/inscription"
                class="ml-1 font-bold text-sky-500 hover:underline underline-offset-4">
                Créer un compte
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>