<template>
  <div class="space-y-6 p-6 bg-slate-50/30 min-h-screen">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Paramètres système</h1>
      <p class="text-slate-500 mt-1">
        Configuration générale de la plateforme
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <section class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <div class="flex items-center gap-2 font-semibold text-lg text-slate-900">
            <Building class="h-5 w-5 text-blue-600" />
            Informations de l'agence
          </div>
          <p class="text-sm text-slate-500 mt-1">Informations affichées sur le site public</p>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700" for="agencyName">Nom de l'agence</label>
            <input id="agencyName" v-model="settings.agencyName" type="text" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700" for="agencyEmail">Email de contact</label>
            <input id="agencyEmail" v-model="settings.agencyEmail" type="email" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700" for="agencyPhone">Téléphone</label>
            <input id="agencyPhone" v-model="settings.agencyPhone" type="text" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700" for="agencyAddress">Adresse</label>
            <textarea id="agencyAddress" v-model="settings.agencyAddress" rows="2" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"></textarea>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Logo de l'agence</label>
            <div class="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer group">
              <Upload class="h-8 w-8 mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
              <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                Télécharger un logo
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <div class="flex items-center gap-2 font-semibold text-lg text-slate-900">
            <SettingsIcon class="h-5 w-5 text-blue-600" />
            Paramètres de réservation
          </div>
          <p class="text-sm text-slate-500 mt-1">Configuration des réservations</p>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Nombre minimum de nuits</label>
            <input v-model.number="settings.minNights" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Frais de service (%)</label>
            <input v-model.number="settings.serviceFee" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-slate-900">Confirmation automatique</p>
              <p class="text-xs text-slate-500">Confirmer automatiquement les réservations</p>
            </div>
            <button 
              type="button"
              @click="settings.autoConfirm = !settings.autoConfirm"
              :class="settings.autoConfirm ? 'bg-blue-600' : 'bg-slate-200'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
            >
              <span :class="settings.autoConfirm ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <div class="flex items-center gap-2 font-semibold text-lg text-slate-900">
            <Mail class="h-5 w-5 text-blue-600" />
            Notifications email
          </div>
          <p class="text-sm text-slate-500 mt-1">Configuration des emails automatiques</p>
        </div>
        <div class="p-6 space-y-6">
          <div v-for="(notif, key) in notifications" :key="key" class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-900">{{ notif.title }}</p>
              <p class="text-xs text-slate-500">{{ notif.desc }}</p>
            </div>
            <button 
              type="button"
              @click="notif.enabled = !notif.enabled"
              :class="notif.enabled ? 'bg-blue-600' : 'bg-slate-200'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
            >
              <span :class="notif.enabled ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <div class="flex items-center gap-2 font-semibold text-lg text-slate-900">
            <Globe class="h-5 w-5 text-blue-600" />
            Paramètres régionaux
          </div>
          <p class="text-sm text-slate-500 mt-1">Langue, devise et format</p>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Langue par défaut</label>
            <select v-model="settings.language" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Devise</label>
            <select v-model="settings.currency" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
              <option value="xof">Franc CFA (FCFA)</option>
              <option value="eur">Euro (EUR)</option>
              <option value="usd">Dollar US (USD)</option>
            </select>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
        <div class="p-6 border-b border-slate-100">
          <div class="flex items-center gap-2 font-semibold text-lg text-slate-900">
            <Shield class="h-5 w-5 text-blue-600" />
            Sécurité
          </div>
          <p class="text-sm text-slate-500 mt-1">Paramètres de sécurité de la plateforme</p>
        </div>
        <div class="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(item, key) in security" :key="key" class="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
            <div>
              <p class="text-sm font-medium text-slate-900">{{ item.title }}</p>
              <p class="text-xs text-slate-500">{{ item.desc }}</p>
            </div>
            <button 
              type="button"
              @click="item.enabled = !item.enabled"
              :class="item.enabled ? 'bg-blue-600' : 'bg-slate-200'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
            >
              <span :class="item.enabled ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>

    <div class="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
      <button 
        @click="resetForm"
        class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
      >
        Annuler les modifications
      </button>
      <button 
        @click="saveSettings" 
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all"
      >
        <Save class="h-4 w-4" />
        Enregistrer les paramètres
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Settings as SettingsIcon, 
  Building, 
  Mail, 
  Globe, 
  Shield, 
  Save, 
  Upload 
} from 'lucide-vue-next'

// Etat initial (pour la fonction annuler)
const initialData = {
  agencyName: 'ImmoGestion',
  agencyEmail: 'contact@immogestion.ci',
  agencyPhone: '+225 27 22 XX XX XX',
  agencyAddress: "Cocody, Abidjan, Côte d'Ivoire",
  minNights: 1,
  serviceFee: 5,
  autoConfirm: false,
  language: 'fr',
  currency: 'xof'
}

// Etat des réglages
const settings = ref({ ...initialData })

// Etat des notifications
const notifications = ref({
  booking: { title: 'Nouvelle réservation', desc: 'Notifier les agents', enabled: true },
  confirmed: { title: 'Réservation confirmée', desc: 'Notifier le client', enabled: true },
  claim: { title: 'Nouvelle réclamation', desc: 'Notifier les agents', enabled: true }
})

// Etat de la sécurité
const security = ref({
  twoFA: { title: 'Authentification 2FA', desc: 'Obliger la 2FA pour les agents', enabled: false },
  session: { title: 'Expiration de session', desc: 'Déconnexion après 30min', enabled: true },
  logs: { title: 'Log des activités', desc: 'Enregistrer toutes les actions', enabled: true }
})

const resetForm = () => {
  if(confirm('Voulez-vous annuler toutes les modifications non enregistrées ?')) {
    settings.value = { ...initialData }
  }
}

const saveSettings = () => {
  const payload = {
    ...settings.value,
    notifications: notifications.value,
    security: security.value
  }
  
  console.log('Envoi vers Laravel :', payload)
  
  // Exemple avec fetch/axios :
  // axios.post('/api/settings', payload).then(...)

  alert('Paramètres enregistrés avec succès !')
}
</script>