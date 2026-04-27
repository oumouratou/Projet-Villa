<script setup>
import { ref } from 'vue'
import { Building2, Mail, ArrowLeft, CheckCircle } from 'lucide-vue-next'

// États
const email = ref("")
const isLoading = ref(false)
const isSubmitted = ref(false)

const handleSubmit = async () => {
  isLoading.value = true

  // Simulation d'envoi d'email
  await new Promise(resolve => setTimeout(resolve, 1500))

  isSubmitted.value = true
  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-background">
    <div class="w-full max-w-md">
      <router-link to="/" class="inline-flex items-center gap-2 mb-8">
        <Building2 class="h-8 w-8 text-primary" />
        <span class="text-xl font-bold text-foreground">ImmoGestion</span>
      </router-link>

      <div v-if="!isSubmitted">
        <h1 class="text-2xl font-bold text-foreground mb-2">Mot de passe oublié ?</h1>
        <p class="text-muted-foreground mb-8">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-foreground mb-2">
              Adresse email
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                v-model="email"
                type="email"
                id="email"
                required
                placeholder="votre@email.com"
                class="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? "Envoi en cours..." : "Envoyer le lien" }}
          </button>
        </form>
      </div>

      <div v-else class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle class="h-8 w-8 text-green-600" />
        </div>
        <h1 class="text-2xl font-bold text-foreground mb-2">Email envoyé</h1>
        <p class="text-muted-foreground mb-8">
          Si un compte existe avec l'adresse <strong>{{ email }}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
        </p>
        <p class="text-sm text-muted-foreground">
          Vous n'avez pas reçu d'email ?
          <button
            @click="isSubmitted = false"
            class="text-primary hover:text-primary/80 font-medium ml-1"
          >
            Renvoyer
          </button>
        </p>
      </div>

      <div class="mt-8">
        <router-link
          to="/connexion"
          class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft class="h-4 w-4" />
          Retour à la connexion
        </router-link>
      </div>
    </div>
  </div>
</template>