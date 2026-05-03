<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Building2, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-vue-next'
import { registerUser } from '@/lib/api'
import { setSession } from '@/lib/session'

const router = useRouter()

// États du formulaire
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+225",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
})

// Logique de validation
const validate = () => {
  const newErrors: Record<string, string> = {}

  if (!formData.firstName) newErrors.firstName = "Le prénom est requis"
  if (!formData.lastName) newErrors.lastName = "Le nom est requis"
  if (!formData.email) newErrors.email = "L'email est requis"
  if (!formData.password) newErrors.password = "Le mot de passe est requis"
  if (formData.password.length < 8) {
    newErrors.password = "Minimum 8 caractères"
  }
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Les mots de passe diffèrent"
  }
  if (!formData.acceptTerms) {
    newErrors.acceptTerms = "Obligatoire"
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  isLoading.value = true

  try {
    const fullPhone = formData.phone.trim()
      ? `${formData.countryCode}${formData.phone.replace(/\s+/g, '')}`
      : undefined

    const result = await registerUser({
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: fullPhone,
      password: formData.password,
    })

    const token = (result as any)?.token
    const user = (result as any)?.user
    if (token && user) {
      setSession(token, user)
      router.push('/client')
    } else {
      router.push('/connexion')
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "L'inscription a échoué"
    if (/already been taken|déjà utilisé|deja utilise/i.test(message)) {
      errors.value = {
        ...errors.value,
        email: "Cet email est déjà utilisé.",
        submit: "Cet email est déjà utilisé.",
      }
    } else {
      errors.value = { ...errors.value, submit: message }
    }
  }

  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen flex bg-[#f8fafc] font-sans antialiased text-slate-900">
    
    <div class="hidden lg:flex lg:w-1/2 bg-[#0f172a] relative overflow-hidden">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#0070f3] opacity-20 blur-[100px] rounded-full" />
      <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0070f3]/20 to-transparent" />

      <div class="relative z-10 flex flex-col justify-center p-16 w-full">
        <div class="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-8 w-fit border border-white/10">
          <Building2 class="h-10 w-10 text-[#0070f3]" />
        </div>
        
        <h2 class="text-5xl font-extrabold text-white mb-6 leading-tight">
          Rejoignez la <br />
          <span class="text-[#0070f3]">communauté.</span>
        </h2>
        
        <div class="space-y-6 mt-8">
          <div v-for="(text, i) in ['Accès gratuit au catalogue', 'Suivi de vos demandes en direct', 'Support client dédié 7j/7']" :key="i" class="flex items-center gap-4 text-slate-300 text-lg">
            <CheckCircle2 class="h-6 w-6 text-[#0070f3]" />
            <span>{{ text }}</span>
          </div>
        </div>

        <div class="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-md">
          <p class="text-slate-400 italic">"L'inscription a pris moins de 2 minutes et j'ai pu visiter mon premier appartement le lendemain."</p>
          <div class="mt-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">SC</div>
            <div>
              <p class="text-white font-bold text-sm">Sophie Colin</p>
              <p class="text-slate-500 text-xs">Utilisatrice vérifiée</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center items-center py-12 px-6 lg:px-12 bg-slate-50">
      <div class="w-full max-w-xl">
        
        <div class="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div class="p-8 lg:p-10">
            <div class="mb-8 text-center lg:text-left">
              <h1 class="text-2xl font-bold text-[#0f172a]">Créer un compte</h1>
              <p class="text-slate-500 text-sm mt-1">Commencez votre recherche immobilière dès maintenant.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div v-if="errors.submit" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ errors.submit }}
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Prénom</label>
                  <div class="relative group">
                    <User class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0070f3] transition-colors" />
                    <input v-model="formData.firstName" type="text" placeholder="Jean"
                      :class="['w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl transition-all outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0070f3]', 
                      errors.firstName ? 'border-red-300' : 'border-slate-200']" />
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nom</label>
                  <input v-model="formData.lastName" type="text" placeholder="Dupont"
                    :class="['w-full px-4 py-3.5 bg-slate-50 border rounded-2xl transition-all outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0070f3]', 
                    errors.lastName ? 'border-red-300' : 'border-slate-200']" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email professionnel ou perso</label>
                <div class="relative group">
                  <Mail class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0070f3] transition-colors" />
                  <input v-model="formData.email" type="email" placeholder="jean@exemple.com"
                    :class="['w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl transition-all outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0070f3]', 
                    errors.email ? 'border-red-300' : 'border-slate-200']" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Téléphone (Optionnel)</label>
                <div class="flex gap-2">
                  <select v-model="formData.countryCode"
                    class="w-28 px-3 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0070f3]">
                    <option value="+225">+225 CI</option>
                    <option value="+33">+33 FR</option>
                    <option value="+221">+221 SN</option>
                    <option value="+223">+223 ML</option>
                    <option value="+226">+226 BF</option>
                    <option value="+1">+1 US</option>
                  </select>
                  <div class="relative group flex-1">
                    <Phone class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0070f3] transition-colors" />
                    <input v-model="formData.phone" type="tel" placeholder="0700000000"
                      class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0070f3]" />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Mot de passe</label>
                  <div class="relative group">
                    <Lock class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                      :class="['w-full pl-11 pr-10 py-3.5 bg-slate-50 border rounded-2xl transition-all outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0070f3]', 
                      errors.password ? 'border-red-300' : 'border-slate-200']" />
                    <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <EyeOff v-if="showPassword" class="h-4 w-4" />
                      <Eye v-else class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Confirmation</label>
                  <div class="relative group">
                    <input v-model="formData.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••"
                      :class="['w-full px-4 py-3.5 bg-slate-50 border rounded-2xl transition-all outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#0070f3]', 
                      errors.confirmPassword ? 'border-red-300' : 'border-slate-200']" />
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <label class="flex items-start gap-3 cursor-pointer group">
                  <input v-model="formData.acceptTerms" type="checkbox" class="mt-1 w-5 h-5 rounded border-slate-300 text-[#0070f3] focus:ring-[#0070f3]" />
                  <span class="text-xs text-slate-500 leading-relaxed group-hover:text-slate-700">
                    J'accepte les <router-link to="#" class="text-[#0070f3] font-bold">conditions d'utilisation</router-link> 
                    et la <router-link to="#" class="text-[#0070f3] font-bold">politique de confidentialité</router-link>.
                  </span>
                </label>
              </div>

              <button type="submit" :disabled="isLoading"
                class="w-full mt-4 py-4 bg-[#0070f3] text-white rounded-2xl font-bold text-lg hover:bg-blue-600 shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-70 transition-all active:scale-[0.98]">
                <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span v-else class="flex items-center gap-2">Créer mon compte <ArrowRight class="h-5 w-5" /></span>
              </button>
            </form>
          </div>

          <div class="bg-slate-50 p-6 border-t border-slate-100 text-center">
            <p class="text-sm text-slate-500 font-medium">
              Déjà membre ? 
              <router-link to="/connexion" class="text-[#0070f3] font-bold hover:underline underline-offset-4 ml-1">Se connecter</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>