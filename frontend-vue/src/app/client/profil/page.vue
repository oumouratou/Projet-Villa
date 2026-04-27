<script setup lang="ts">
import { ref } from 'vue'
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, CheckCircle } from 'lucide-vue-next'
import DashboardHeader from '@/components/DashboardHeader.vue'

const isEditing = ref(false)
const showPasswordForm = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const saveSuccess = ref(false)

const profileData = ref({
  firstName: 'Sophie',
  lastName: 'Leroy',
  email: 'sophie.leroy@email.com',
  phone: '06 12 34 56 78',
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const handleProfileSave = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isEditing.value = false
  saveSuccess.value = true
  setTimeout(() => (saveSuccess.value = false), 3000)
}

const handlePasswordChange = async (e: Event) => {
  e.preventDefault()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  passwordData.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  showPasswordForm.value = false
  saveSuccess.value = true
  setTimeout(() => (saveSuccess.value = false), 3000)
}
</script>

<template>
  <DashboardHeader title="Mon profil" subtitle="Gerez vos informations personnelles" />

  <main class="flex-1 p-6 overflow-auto">
    <div v-if="saveSuccess" class="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
      <CheckCircle class="h-5 w-5" />
      <span>Modifications enregistrees avec succes</span>
    </div>

    <div class="max-w-2xl space-y-6">
      <div class="rounded-xl border border-border bg-card">
        <div class="flex items-center justify-between border-b border-border p-5">
          <h2 class="font-semibold text-foreground">Informations personnelles</h2>
          <button v-if="!isEditing" class="px-4 py-2 text-sm font-medium text-primary" @click="isEditing = true">Modifier</button>
          <div v-else class="flex gap-2">
            <button class="px-4 py-2 text-sm font-medium text-muted-foreground" @click="isEditing = false">Annuler</button>
            <button class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" @click="handleProfileSave">
              <Save class="h-4 w-4" />
              Enregistrer
            </button>
          </div>
        </div>

        <div class="space-y-5 p-5">
          <div class="mb-6 flex items-center gap-4">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <User class="h-10 w-10 text-primary" />
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-foreground">Prenom</label>
              <input v-if="isEditing" v-model="profileData.firstName" class="w-full rounded-lg border border-input bg-background px-4 py-2.5" type="text" />
              <p v-else class="text-foreground">{{ profileData.firstName }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-foreground">Nom</label>
              <input v-if="isEditing" v-model="profileData.lastName" class="w-full rounded-lg border border-input bg-background px-4 py-2.5" type="text" />
              <p v-else class="text-foreground">{{ profileData.lastName }}</p>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-foreground"><Mail class="mr-1 inline h-4 w-4" />Email</label>
            <input v-if="isEditing" v-model="profileData.email" class="w-full rounded-lg border border-input bg-background px-4 py-2.5" type="email" />
            <p v-else class="text-foreground">{{ profileData.email }}</p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-foreground"><Phone class="mr-1 inline h-4 w-4" />Telephone</label>
            <input v-if="isEditing" v-model="profileData.phone" class="w-full rounded-lg border border-input bg-background px-4 py-2.5" type="tel" />
            <p v-else class="text-foreground">{{ profileData.phone }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card">
        <div class="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 class="font-semibold text-foreground">Mot de passe</h2>
            <p class="mt-1 text-sm text-muted-foreground">Modifiez votre mot de passe</p>
          </div>
          <button v-if="!showPasswordForm" class="px-4 py-2 text-sm font-medium text-primary" @click="showPasswordForm = true">Modifier</button>
        </div>

        <form v-if="showPasswordForm" class="space-y-4 p-5" @submit="handlePasswordChange">
          <div>
            <label class="mb-2 block text-sm font-medium text-foreground">Mot de passe actuel</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input v-model="passwordData.currentPassword" :type="showCurrentPassword ? 'text' : 'password'" class="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" @click="showCurrentPassword = !showCurrentPassword">
                <EyeOff v-if="showCurrentPassword" class="h-5 w-5" />
                <Eye v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-foreground">Nouveau mot de passe</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input v-model="passwordData.newPassword" :type="showNewPassword ? 'text' : 'password'" minlength="8" class="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" @click="showNewPassword = !showNewPassword">
                <EyeOff v-if="showNewPassword" class="h-5 w-5" />
                <Eye v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-foreground">Confirmer le nouveau mot de passe</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input v-model="passwordData.confirmPassword" type="password" class="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4" />
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="px-4 py-2 text-sm font-medium text-muted-foreground" @click="showPasswordForm = false">Annuler</button>
            <button type="submit" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Changer le mot de passe</button>
          </div>
        </form>
      </div>

      <div class="rounded-xl border border-border bg-card p-5">
        <h2 class="mb-4 font-semibold text-foreground">Informations du compte</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="text-muted-foreground">Date d'inscription</span><span class="text-foreground">10 janvier 2024</span></div>
          <div class="flex justify-between"><span class="text-muted-foreground">Derniere connexion</span><span class="text-foreground">Aujourd'hui a 14:30</span></div>
          <div class="flex justify-between"><span class="text-muted-foreground">Statut du compte</span><span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Actif</span></div>
        </div>
      </div>
    </div>
  </main>
</template>
