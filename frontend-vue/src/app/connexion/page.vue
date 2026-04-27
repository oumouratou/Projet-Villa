<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-vue-next'
import { loginUser } from '@/lib/api'

const router = useRouter()

const showPassword = ref(false)
const isLoading = ref(false)
const error = ref("")
const formData = reactive({
  email: "",
  password: "",
})

const handleSubmit = async () => {
  error.value = ""
  isLoading.value = true

  try {
    const result = await loginUser(formData.email, formData.password)
    const role = (result.user as { role?: string }).role ?? 'client'

    if (role === 'admin') {
      router.push('/admin')
    } else if (role === 'agent') {
      router.push('/agent')
    } else {
      router.push('/client')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Connexion impossible'
  }

  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen flex bg-[#f8fafc] font-sans antialiased text-slate-900">
    
    <div class="hidden lg:flex lg:w-1/2 bg-[#0f172a] relative overflow-hidden">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#0070f3] opacity-20 blur-[100px] rounded-full"></div>
      <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0070f3]/20 to-transparent"></div>

      <div class="relative z-10 flex flex-col justify-center p-16 w-full">
        <div class="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-8 w-fit border border-white/10">
          <Building2 class="h-10 w-10 text-[#0070f3]" />
        </div>
        
        <h2 class="text-5xl font-extrabold text-white mb-6 leading-tight">
          La gestion immobilière <br />
          <span class="text-[#0070f3]">réinventée.</span>
        </h2>
        
        <div class="space-y-6 mt-8">
          <div v-for="(text, i) in ['Tableaux de bord intuitifs', 'Gestion automatisée des contrats', 'Paiements sécurisés en ligne']" :key="i" class="flex items-center gap-4 text-slate-300 text-lg">
            <CheckCircle2 class="h-6 w-6 text-[#0070f3]" />
            <span>{{ text }}</span>
          </div>
        </div>

        <div class="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-md">
          <p class="text-slate-400 italic">"ImmoGestion a réduit notre temps de gestion administrative de 40% dès le premier mois."</p>
          <div class="mt-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">JR</div>
            <div>
              <p class="text-white font-bold text-sm">Jean-Marc Riva</p>
              <p class="text-slate-500 text-xs">Directeur Agence Azur</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center items-center py-12 px-6 lg:px-12 bg-slate-50">
      
      <div class="w-full max-w-md">
        <div class="lg:hidden flex justify-center mb-8">
          <div class="flex items-center gap-2">
            <Building2 class="h-8 w-8 text-[#0070f3]" />
            <span class="text-2xl font-bold text-[#0f172a]">ImmoGestion</span>
          </div>
        </div>

        <div class="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div class="p-8 lg:p-10">
            <div class="mb-8">
              <h1 class="text-2xl font-bold text-[#0f172a]">Connexion</h1>
              <p class="text-slate-500 text-sm mt-1">Ravi de vous revoir !</p>
            </div>

            <div v-if="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {{ error }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div class="space-y-2">
                <label for="email" class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email professionnel</label>
                <div class="relative group">
                  <Mail class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0070f3] transition-colors" />
                  <input
                    v-model="formData.email"
                    type="email"
                    id="email"
                    required
                    placeholder="ex: marie@immo.com"
                    class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 transition-all focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#0070f3] outline-none"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center ml-1">
                  <label for="password" class="text-xs font-bold uppercase tracking-wider text-slate-500">Mot de passe</label>
                </div>
                <div class="relative group">
                  <Lock class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0070f3] transition-colors" />
                  <input
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    required
                    placeholder="••••••••"
                    class="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 transition-all focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#0070f3] outline-none"
                  />
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0f172a]">
                    <EyeOff v-if="showPassword" class="h-5 w-5" />
                    <Eye v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between px-1">
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" class="w-4 h-4 rounded border-slate-300 text-[#0070f3] focus:ring-[#0070f3]" />
                  <span class="text-sm text-slate-500 group-hover:text-slate-900 transition-colors font-medium">Se souvenir</span>
                </label>
                <router-link to="/mot-de-passe-oublie" class="text-sm font-semibold text-[#0070f3] hover:text-blue-700">Mot de passe Oublié ?</router-link>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-full mt-4 py-4 bg-[#0070f3] text-white rounded-2xl font-bold text-lg hover:bg-blue-600 hover:shadow-blue-500/40 active:scale-[0.98] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                <span v-else class="flex items-center gap-2">Se connecter <ArrowRight class="h-5 w-5" /></span>
              </button>
            </form>
          </div>

          <div class="bg-slate-50 p-6 border-t border-slate-100 text-center">
            <p class="text-sm text-slate-500 font-medium">
              Pas encore inscrit ? 
              <router-link to="/inscription" class="text-[#0070f3] font-bold hover:underline underline-offset-4 ml-1">Créer un compte</router-link>
            </p>
          </div>
        </div>

        <p class="mt-12 text-center text-slate-400 text-[10px] tracking-[0.2em] uppercase font-bold">
          &copy; 2026 ImmoGestion &bull; Plateforme Sécurisée
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Suppression de la déclaration invalide qui causait l'erreur Vite */
</style>